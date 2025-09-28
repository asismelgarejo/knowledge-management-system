import { Application, IApplication } from "@/resources/application/application";
import { CreateBookHandler } from "@/resources/application/commands";
import { GetBookHandler } from "@/resources/application/queries";
import { COLLECTION_NAMES } from "@/resources/infrastructure/repositories";
import { BookRepo } from "@/resources/infrastructure/repositories/book-repo";
import { CommandBus } from "@/resources/shared/utils/cqrs/command-bus";
import { QueryBus } from "@/resources/shared/utils/cqrs/query-bus";
import { IMonolithSeeder } from "@/shared/monolith";
import { isLeft } from "fp-ts/lib/Either";
import fs from "fs";
import path from "path";

export class CreateBooksSeeder {
  constructor(private readonly mono: IMonolithSeeder) {}

  private getApp(): IApplication {
    const resourceRepo = BookRepo.New(COLLECTION_NAMES.BOOKS, this.mono.db);
    const authorRepo = BookRepo.New(COLLECTION_NAMES.AUTHORS, this.mono.db);
    const categoryRepo = BookRepo.New(COLLECTION_NAMES.CATEGORIES, this.mono.db);
    const tagRepo = BookRepo.New(COLLECTION_NAMES.TAGS, this.mono.db);

    // commands
    const commandBus = new CommandBus();
    const createBookHandler = new CreateBookHandler(resourceRepo);
    const commandHandlers = [createBookHandler];
    commandBus.register(commandHandlers);
    // queries
    const queryBus = new QueryBus();
    const getBookHander = new GetBookHandler(resourceRepo);
    const queryHandlers = [getBookHander];
    queryBus.register(queryHandlers);

    return new Application(commandBus, queryBus);
  }

  private getData() {
    const data = fs.readFileSync(path.join(__dirname, "./books.json"));
    const records = JSON.parse(data.toString());
    return records;
  }

  async execute() {
    const app = this.getApp();
    const books = this.getData();
    for await (const data of books) {
      function formatISBN(isbn: string) {
        // Patrón para validar si ya está en el formato deseado
        const regexPattern = /^(978|979)-(\d{1,5})-(\d{1,7})-(\d{1,6})-(\d)$/;

        // Verifica si el ISBN ya está en el formato correcto
        if (regexPattern.test(isbn)) {
          return isbn; // Devuelve el ISBN sin cambios si ya está en el formato correcto
        }

        // Patrón para formatear el ISBN
        const pattern = /^(\d{3})(\d{1})(\d{5})(\d{3})(\d{1})$/;
        return isbn.replace(pattern, "$1-$2-$3-$4-$5");
      }

      data.isbn = formatISBN(data.isbn);
      const response = await app.createResource(data);
      if (isLeft(response)) {
        console.log(">>data", data);
        console.error(response.left.code);
        process.exit(0);
      }
    }

    console.log("Done!");
    process.exit(0);
  }
}

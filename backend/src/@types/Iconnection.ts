// import { DataSource } from 'typeorm';

// export interface IConnection {
//   connect(): Promise<void>;
//   fakeConnect(): void;
//   readonly client: string;
//   readonly dataSource: DataSource;
// }

// const dataSources = new Map<string, DataSource>();

// export const FakeDataSource = (database: string): DataSource => {
//   if (!dataSources.has(database)) {
//     const dataSource = {
//       isInitialized: true,
//       createQueryRunner() {
//         const self = {
//           rollbackTransaction: async (): Promise<void> => {
//             self.isTransactionActive = false;
//           },
//           commitTransaction: async (): Promise<void> => {
//             self.isTransactionActive = false;
//           },
//           startTransaction: async (): Promise<void> => {
//             self.isTransactionActive = true;
//           },
//           release: async (): Promise<void> => {
//             self.isReleased = true;
//           },
//           isTransactionActive: false,
//           isReleased: false,
//         };
//         return self;
//       },
//     } as DataSource;

//     dataSources.set(database, dataSource);
//   }

//   return dataSources.get(database)!;
// };

// export const PgDataSource = (database: string): DataSource => {
//   if (!dataSources.has(database)) {
//     const dataSource = new DataSource({
//       ...ormConfig.config.default,
//       ...ormConfig.config.,
//       database: ormConfig.config.setDatabase(database),
//     });

//     dataSources.set(database, dataSource);
//   }

//   return dataSources.get(database)!;
// };

// export class Connection implements IConnection {
//   public readonly client: string;

//   public readonly dataSource: DataSource;

//   public constructor(client?: string) {
//     if (appConfig.config.apiMode === 'test') {
//       this.client = 'database_test';
//     } else if (client) {
//       this.client = client;
//     }
//   }

//   private setFakeDataSources(): void {
//     Object.assign(this, {
//       mysql: FakeDataSource(this.client),
//     });
//   }

//   private setDataSources(): void {
//     Object.assign(this, {
//       mysql: PgDataSource(this.client ?? ormConfig.config.mysql.database),
//     });
//   }

//   public fakeConnect(): void {
//     this.setFakeDataSources();
//   }

//   public async connect(): Promise<void> {
//     this.setDataSources();

//     if (!this.dataSource.isInitialized) {
//       await this.dataSource.initialize();
//     }
//   }
// }

const MYSQLCONFIG: any = {
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "123456",
    database: "studyhub",
    entities: ["dist/**/*.entity{.ts,.js}"],
    synchronize: true
}

export default MYSQLCONFIG
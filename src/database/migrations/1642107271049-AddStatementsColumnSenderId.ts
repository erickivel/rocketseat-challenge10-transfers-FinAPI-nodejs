import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey } from "typeorm";

export class AddStatementsColumnSenderId1642107271049 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn("statements", new TableColumn({
            name: "sender_id",
            type: "uuid",
            isNullable: true
        }));

        await queryRunner.changeColumn("statements", "type", new TableColumn({
            name: "type",
            type: "enum",
            enum: ["deposit", "withdraw", "transfer"]
        }));

        await queryRunner.createForeignKey("statements", new TableForeignKey({
            name: "FKUserTransfer",
            columnNames: ["sender_id"],
            referencedColumnNames: ["id"],
            referencedTableName: "users",
            onDelete: "SET NULL",
            onUpdate: "SET NULL"
        }))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey("statements", "FKUserTransfer");
        await queryRunner.changeColumn("statements", "type", new TableColumn({
            name: 'type',
            type: 'enum',
            enum: ['deposit', 'withdraw']
        }));
        await queryRunner.dropTable("statements");
    }

}

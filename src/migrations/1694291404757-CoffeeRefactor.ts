import { MigrationInterface, QueryRunner } from "typeorm"

export class CoffeeRefactor1694291404757 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "coffee" RENAME COLUMN "name" TO "title"`
        )
        await queryRunner.query(
            `ALTER TABLE "coffee" ADD "description" character varying`
        )
        // await queryRunner.query(
        //     `ALTER TABLE "coffee" ADD "recommendations" integer NOT NULL DEFAULT '0'`
        // )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "coffee" RENAME COLUMN "title" TO "name"`
        )
        await queryRunner.query(
            `ALTER TABLE "coffee" DROP COLUMN "description"`
        )
        // await queryRunner.query(
        //     `ALTER TABLE "coffee" DROP COLUMN "recommendations"`
        // )
    }

}

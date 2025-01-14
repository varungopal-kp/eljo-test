import {
  AutoIncrement,
  Column,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';

@Table
export class Transfer extends Model<Transfer> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column
  fromEmail: string;

  @Column
  filePath: string;

  @Column
  toEmail: string;

  @Column
  title: string;

  @Column
  message: string;

  @Column
  status: boolean;
}

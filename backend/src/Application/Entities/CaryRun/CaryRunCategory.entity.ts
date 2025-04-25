import { Column, Entity } from 'typeorm';
import { CustomBaseEntity } from '../Base.entity';
import { TABLE } from 'src/@metadata/tables';
import { RequireOnlyOne } from '#types';

@Entity({ name: TABLE.cary_run_category })
export class CaryRunCategoryEntity extends CustomBaseEntity {
  @Column({ type: 'varchar', unique: true, length: 40 })
  name: string;

  @Column({ type: 'varchar', nullable: true, default: null, length: 120 })
  description: string | null;

  @Column({ type: 'varchar', nullable: true, default: null, length: 255 })
  image: string | null;
}

export type CaryRunCategoryUpdateEntity = Partial<CaryRunCategoryEntity>;

export type CaryRunCategoryUniqueRefs = RequireOnlyOne<
  Pick<CaryRunCategoryEntity, 'id' | 'name'>
>;

import { TABLE } from 'src/@metadata/tables';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { CustomBaseEntity } from '../Base.entity';
import { CaryRunCategoryEntity } from './CaryRunCategory.entity';
import { RequireOnlyOne } from '#types';

@Entity({ name: TABLE.cary_run })
export class CaryRunEntity extends CustomBaseEntity {
  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'decimal' })
  price: string;

  @Column({ type: 'numeric', nullable: true })
  amount: number | null; // if null then is infinite, but if 0 is empty

  @Column({ type: 'varchar', nullable: true, default: null })
  description: string | null;

  @Column({ type: 'varchar', nullable: true, default: null })
  image: string | null;

  // -> relations
  @ManyToOne(() => CaryRunCategoryEntity)
  @JoinColumn({ name: 'categoryId' })
  Category: CaryRunCategoryEntity;

  @Column({ type: 'varchar' })
  categoryId: string;
}

export type CaryRunUpdateEntity = Partial<CaryRunEntity>;

export type CaryRunUniqueRefs = RequireOnlyOne<Pick<CaryRunEntity, 'id'>>;

import { AUTH_ROLES } from 'src/common/types/auth';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column('simple-array', { default: [AUTH_ROLES.KOLACHE_GAME_USER] })
  roles: AUTH_ROLES[];
}

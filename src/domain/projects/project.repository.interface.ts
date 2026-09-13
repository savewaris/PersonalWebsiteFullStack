import type { ProjectEntity, CreateProjectInput, UpdateProjectInput } from './project.types';

export interface IProjectRepository {
  findAll(): Promise<ProjectEntity[]>;
  findById(id: string): Promise<ProjectEntity | null>;
  create(data: CreateProjectInput): Promise<ProjectEntity>;
  update(id: string, data: UpdateProjectInput): Promise<ProjectEntity>;
  delete(id: string): Promise<void>;
}

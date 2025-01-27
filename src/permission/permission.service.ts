import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission } from './entities/permission.entity';
import { PagingDto } from '@shared/base/paging.dto';
import { RoleService } from '../role/role.service';
import { AssignPermissionDto } from './dto/asign-permission.dto';
import {
  PermissionNotFoundException,
  PermissionAlreadyExistsException
} from './exceptions';
@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
    private readonly roleRoleService : RoleService
  ) {}

  async create(createPermissionDto: CreatePermissionDto):Promise<string> {
    const isExist = await this.permissionRepository.findOne({where:{name:createPermissionDto.name}})
    if(isExist){
      throw new PermissionAlreadyExistsException()
    }
    const permission = await this.permissionRepository.create({...createPermissionDto})
    await this.permissionRepository.save(permission)
    return permission.id
  }

  async findAll(pagingDto:PagingDto) {
        const page = pagingDto.page ?? 1;
        const limit = pagingDto.limit ?? 10;
        const offset = (page - 1) * limit;
        const cond = {
          where: [
            { name: Like(`%${pagingDto.search ?? ''}%`) },     
            { description: Like(`%${pagingDto.search ?? ''}%`) }   
          ],
          order: {
            name: pagingDto.sort as 'ASC' | 'DESC' ?? 'ASC',
          },
          take: limit,
          skip: offset,
        };
    
        return this.permissionRepository.find(cond);
  }

  async findOne(id: string):Promise<Permission> {
      const permission = await this.permissionRepository.findOne({where:{id}})
      if(!permission){
        throw new PermissionNotFoundException()
      }
      return permission 
  }

  async update(id: string, updatePermissionDto: UpdatePermissionDto) {
    const permission = await this.permissionRepository.findOne({where:{id}})
    if(!permission){
      throw new PermissionNotFoundException()
    }
    await this.permissionRepository.update({id},{...updatePermissionDto})
  }

  async remove(id: string) {
    const permission = await this.permissionRepository.findOne({where:{id}})
    if(!permission){
      throw new PermissionNotFoundException()
    }
    await this.permissionRepository.softDelete({id})
  }

  async assignPermission(assignPermissionDto: AssignPermissionDto) {
    const permissions = await this.permissionRepository.findByIds(assignPermissionDto.permissionIds)
    if(permissions.length !== assignPermissionDto.permissionIds.length){
      throw new PermissionNotFoundException()
    }
    this.roleRoleService.updatePermissions(assignPermissionDto.roleId, permissions);
  }

}

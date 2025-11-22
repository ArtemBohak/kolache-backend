import { Controller } from '@nestjs/common';
import { Roles } from 'guards/roles.decorator';
import { AUTH_ROLES } from 'types/auth';

@Roles(AUTH_ROLES.KOLACHE_BOT_PRODUCTS_WASTE_USER)
@Controller('products-waste')
export class ProductsWasteController {}

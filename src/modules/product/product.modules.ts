import { Module, OnModuleInit } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { EntityManager } from 'typeorm';
import { InjectEntityManager } from '@nestjs/typeorm';

@Module({
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule implements OnModuleInit {
  constructor(
    @InjectEntityManager()
    private entityManager: EntityManager,
  ) {}

  async onModuleInit() {
    await this.entityManager.query(
      'CREATE TABLE IF NOT EXISTS products (id SERIAL PRIMARY KEY, name VARCHAR(255) NOT NULL, price DECIMAL(10, 2) NOT NULL, description TEXT NOT NULL, images TEXT[] NOT NULL, category VARCHAR(255) NOT NULL, brand VARCHAR(255) NOT NULL, rate INT NOT NULL DEFAULT 0, stock INT NOT NULL DEFAULT 0, is_active BOOLEAN NOT NULL DEFAULT true)',
    );
    await this.entityManager.query(
      `INSERT INTO products (name, price, description, images, category, brand, rate, stock, is_active) VALUES 
        ('Wireless Mouse', 29.99, 'Ergonomic wireless mouse with 2.4GHz connectivity.',
        ARRAY['https://i.imgur.com/MRvrzXk.png',
        'https://i.imgur.com/X46GeJr.png',
        'https://i.imgur.com/ZJGYkaY.png',
        'https://i.imgur.com/DT624Ij.png'], 'Electronics', 'Logitech', 3, 50, true),
        ('Mechanical Keyboard', 89.99, 'RGB backlit mechanical keyboard with brown switches.',
        ARRAY['https://www.redragonzone.com/cdn/shop/products/55-100-111_01_530x@2x.png?v=1572849529',
        'https://www.redragonzone.com/cdn/shop/products/55-100-111_03_450x450.png?v=1572849560',
        'https://www.redragonzone.com/cdn/shop/products/55-100-111_02_450x450.png?v=1572849560',
        'https://www.redragonzone.com/cdn/shop/products/55-100-111_05_450x450.png?v=1572849556'], 'Electronics', 'Keychron', 4, 30, true),
        ('Smartphone Stand', 15.99, 'Adjustable aluminum smartphone stand for desk use.',
        ARRAY['https://i.imgur.com/l3etd15.png',
        'https://i.imgur.com/52aB41o.png',
        'https://i.imgur.com/MCJUDqU.png',
        'https://i.imgur.com/2S2NzId.png'], 'Accessories', 'Anker', 5, 100, true),
        ('Bluetooth Headphones', 199.99, 'Noise-canceling over-ear Bluetooth headphones.',
        ARRAY['https://assets.bosecreative.com/transform/e78bbadf-cbee-443c-aeda-17b81dc71ec8/SF_PDP_GALLERY_BLACK-1?quality=90&io=width:816,height:667,transform:fit&io=width:816,height:667,transform:fit',
        'https://assets.bosecreative.com/transform/315d0d30-1503-4a3a-9105-a228150d9bbb/QCUH_SF_PDP_Gallery_Black_x2_2?quality=90&io=width:816,height:667,transform:fit&io=width:816,height:667,transform:fit',
        'https://assets.bosecreative.com/transform/5859e809-52cc-4762-8f30-ec3b2ac582be/QCUH_SF_PDP_Gallery_Black_x2_4?quality=90&io=width:816,height:667,transform:fit&io=width:816,height:667,transform:fit',
        'https://assets.bosecreative.com/transform/e0a2998e-1a07-47b3-84a8-5c23026886d5/QCUH_SF_PDP_Gallery_Black_x2_7?quality=90&io=width:816,height:667,transform:fit&io=width:816,height:667,transform:fit'], 'Audio', 'Sony', 4, 20, true),
        ('Gaming Chair', 249.99, 'Ergonomic gaming chair with lumbar support and adjustable armrests.',
        ARRAY['https://i.imgur.com/0VKVWXW.png',
        'https://i.imgur.com/MiAoOBm.png',
        'https://i.imgur.com/UISMdA2.png',
        'https://i.imgur.com/3SmHbCs.png'], 'Furniture', 'Secretlab', 5, 10, true)
      `,
    );
  }
}

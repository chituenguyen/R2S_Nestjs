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
    // await this.entityManager.query(`DROP TABLE IF EXISTS products`);
    // await this.entityManager.query(
    //   'CREATE TABLE IF NOT EXISTS products (id SERIAL PRIMARY KEY, name VARCHAR(255) NOT NULL, price DECIMAL(10, 2) NOT NULL, description TEXT NOT NULL, images TEXT[] NOT NULL, category VARCHAR(255) NOT NULL, brand VARCHAR(255) NOT NULL, rate INT NOT NULL DEFAULT 0, stock INT NOT NULL DEFAULT 0, is_active BOOLEAN NOT NULL DEFAULT true)',
    // );
    // await this.entityManager.query(
    //   `INSERT INTO products (name, price, description, images, category, brand, rate, stock, is_active) VALUES
    //     ('Wireless Mouse', 29.99, 'Ergonomic wireless mouse with 2.4GHz connectivity.',
    //     ARRAY['https://lh5.googleusercontent.com/fYoOmmun-7w8Rs3oHrLeXAZfeXL5Y-roYLQCgNG6nhbrOLWfCnc2sXaTNmoDv-Av90VlCuHincF24zG-waIv1b-ft4f5KPPfJAMpvfIxA8tfIQKvxPOr_ouVBEMdm9P4hA=w1280',
    //     'https://lh5.googleusercontent.com/SnEjPv6PkL0IT4U8KPiRYUD-WTUuAG11Pqa_HtDXlLlaICy2wyqgg6Oe_n7Xjemxt97ituQ4M40IwhMIe0TwSaQ=w1280',
    //     'https://lh5.googleusercontent.com/fYoOmmun-7w8Rs3oHrLeXAZfeXL5Y-roYLQCgNG6nhbrOLWfCnc2sXaTNmoDv-Av90VlCuHincF24zG-waIv1b-ft4f5KPPfJAMpvfIxA8tfIQKvxPOr_ouVBEMdm9P4hA=w1280',
    //     'https://lh5.googleusercontent.com/fYoOmmun-7w8Rs3oHrLeXAZfeXL5Y-roYLQCgNG6nhbrOLWfCnc2sXaTNmoDv-Av90VlCuHincF24zG-waIv1b-ft4f5KPPfJAMpvfIxA8tfIQKvxPOr_ouVBEMdm9P4hA=w1280'], 'Electronics', 'Logitech', 3, 50, true),
    //     ('Mechanical Keyboard', 89.99, 'RGB backlit mechanical keyboard with brown switches.',
    //     ARRAY['https://www.redragonzone.com/cdn/shop/products/55-100-111_01_530x@2x.png?v=1572849529',
    //     'https://www.redragonzone.com/cdn/shop/products/55-100-111_01_530x@2x.png?v=1572849529',
    //     'https://www.redragonzone.com/cdn/shop/products/55-100-111_01_530x@2x.png?v=1572849529',
    //     'https://www.redragonzone.com/cdn/shop/products/55-100-111_01_530x@2x.png?v=1572849529'], 'Electronics', 'Keychron', 4, 30, true),
    //     ('Smartphone Stand', 15.99, 'Adjustable aluminum smartphone stand for desk use.',
    //     ARRAY['https://lh3.googleusercontent.com/iKi5pkbrd_uVZDjLNDMsOzIHd9Sh-7XxDeLS9EqCQGFzSuaIh0HySXvld6BrWYmU6bWqSRwzh0COPEclfRpHCgM=w1280',
    //     'https://lh3.googleusercontent.com/iKi5pkbrd_uVZDjLNDMsOzIHd9Sh-7XxDeLS9EqCQGFzSuaIh0HySXvld6BrWYmU6bWqSRwzh0COPEclfRpHCgM=w1280',
    //     'https://lh3.googleusercontent.com/iKi5pkbrd_uVZDjLNDMsOzIHd9Sh-7XxDeLS9EqCQGFzSuaIh0HySXvld6BrWYmU6bWqSRwzh0COPEclfRpHCgM=w1280',
    //     'https://lh3.googleusercontent.com/iKi5pkbrd_uVZDjLNDMsOzIHd9Sh-7XxDeLS9EqCQGFzSuaIh0HySXvld6BrWYmU6bWqSRwzh0COPEclfRpHCgM=w1280'], 'Accessories', 'Anker', 5, 100, true),
    //     ('Bluetooth Headphones', 199.99, 'Noise-canceling over-ear Bluetooth headphones.',
    //     ARRAY['https://lh5.googleusercontent.com/wWOYYqoF_7MGBvuinnRZGngqO63ILoXc_6A8shhMzWJ-QVzf27A8Zg94Y9VubD76wR3RvxDQT_uVaXGE7Vsx6Gw7yycGyFLKmFdFlj9kUJsNFo_QDwsRTIl3vdiqM540Dw=w1280',
    //     'https://lh5.googleusercontent.com/wWOYYqoF_7MGBvuinnRZGngqO63ILoXc_6A8shhMzWJ-QVzf27A8Zg94Y9VubD76wR3RvxDQT_uVaXGE7Vsx6Gw7yycGyFLKmFdFlj9kUJsNFo_QDwsRTIl3vdiqM540Dw=w1280',
    //     'https://lh5.googleusercontent.com/wWOYYqoF_7MGBvuinnRZGngqO63ILoXc_6A8shhMzWJ-QVzf27A8Zg94Y9VubD76wR3RvxDQT_uVaXGE7Vsx6Gw7yycGyFLKmFdFlj9kUJsNFo_QDwsRTIl3vdiqM540Dw=w1280',
    //     'https://lh5.googleusercontent.com/wWOYYqoF_7MGBvuinnRZGngqO63ILoXc_6A8shhMzWJ-QVzf27A8Zg94Y9VubD76wR3RvxDQT_uVaXGE7Vsx6Gw7yycGyFLKmFdFlj9kUJsNFo_QDwsRTIl3vdiqM540Dw=w1280'], 'Audio', 'Sony', 4, 20, true),
    //     ('Gaming Chair', 249.99, 'Ergonomic gaming chair with lumbar support and adjustable armrests.',
    //     ARRAY['https://lh6.googleusercontent.com/aHYq4RWb0BaGFbjnjx8uRqfsL9pAC93WJiue_T6XxBR3tQJ44zJKkDCvj8vitskok6lN8utq_ARHpx4vPqPXhFs=w1280',
    //     'https://lh6.googleusercontent.com/aHYq4RWb0BaGFbjnjx8uRqfsL9pAC93WJiue_T6XxBR3tQJ44zJKkDCvj8vitskok6lN8utq_ARHpx4vPqPXhFs=w1280',
    //     'https://lh6.googleusercontent.com/aHYq4RWb0BaGFbjnjx8uRqfsL9pAC93WJiue_T6XxBR3tQJ44zJKkDCvj8vitskok6lN8utq_ARHpx4vPqPXhFs=w1280',
    //     'https://lh6.googleusercontent.com/aHYq4RWb0BaGFbjnjx8uRqfsL9pAC93WJiue_T6XxBR3tQJ44zJKkDCvj8vitskok6lN8utq_ARHpx4vPqPXhFs=w1280'], 'Furniture', 'Secretlab', 5, 10, true)
    //   `,
    // );
  }
}

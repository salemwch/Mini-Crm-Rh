    import { forwardRef, Module } from "@nestjs/common";
    import { MongooseModule } from "@nestjs/mongoose";
    import { AuditLogSchema } from "./entities/entities.schema";
    import { AuditLogController } from "./audit.controller";
    import { AuditLogService } from "./audit.service";
    import { AuthModule } from "src/auth/auth.module";
    import { UserModule } from "src/user/user.module";
    import { ContactModule } from "src/contact/contact.module";

    @Module({
        imports: [ MongooseModule.forFeature([{name: 'AuditLog', schema: AuditLogSchema}]),
        forwardRef(() => UserModule),
        forwardRef(() => AuthModule),
        forwardRef(() => ContactModule),
    ],
        controllers: [AuditLogController],
        providers:[AuditLogService],
        exports: [AuditLogService],
    })

    export class AuditLogModule{}
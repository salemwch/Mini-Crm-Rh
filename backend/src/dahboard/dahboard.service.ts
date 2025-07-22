import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ContactService } from 'src/contact/contact.service';
import { EnterpriseService } from 'src/enterprise/enterprise.service';
import { FeedbacksService } from 'src/feedbacks/feedbacks.service';
import { User } from 'src/user/entities/user.schema';
import { GlobalStatistics } from './interface/dashboard.interface';
import { UserRole } from 'src/user/dto/create-user.dto';
import { JobOfferService } from 'src/joboffer/joboffer.service';

@Injectable()
export class DahboardService {
    constructor(@InjectModel(User.name) private readonly userModel: Model<User>,
                                        private readonly enterpriseService: EnterpriseService,
                                        private readonly contactService: ContactService,
                                        private readonly feedbackService: FeedbacksService,
                                        private readonly jobOfferService: JobOfferService,
){}

    async getGlobalStatics(): Promise<GlobalStatistics> {
        const [totalUsers,
            activeUsers, 
            inactiveUsers, 
            rhUsers, 
            adminUsers, 
            totalEnterprises, 
            totalContacts, 
            totalFeedbacks, 
            ] = await Promise.all([
            this.userModel.countDocuments(),
            this.userModel.countDocuments({ isActive: true }),
            this.userModel.countDocuments({ isActive: false }),
            this.userModel.countDocuments({ role: UserRole.RH }),
            this.userModel.countDocuments({ role: UserRole.ADMIN }),
            this.enterpriseService.getTotalEnterpirses(),
            this.contactService.getGlobalContact(),
            this.feedbackService.GlobalFeedbacks(),
            this.jobOfferService.getStatistics(),
        ]);
        return {
            totalUsers,
            activeUsers,
            inactiveUsers,
            rhUsers,
            adminUsers,
            totalEnterprises,
            totalContacts,
            totalFeedbacks,
            
        }
    }
    

}

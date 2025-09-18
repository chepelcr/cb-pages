import type {Request, Response} from 'express';
import {Router} from 'express';
import {userService} from '../dependency_injection';
import {insertUserSchema, updateUserSchema, type User, type UpdateUser} from '../models';
import { CompanyUserService } from '../services/CompanyUserService';


export class UserController {
    private companyUserService = new CompanyUserService();

    getRouter(): Router {
        const router = Router();

        router.get('/:id/profile', this.getUserProfile.bind(this));

        router.put('/:id/profile', this.updateUser.bind(this));

        router.post('/:userId/verify-email-complete', this.verifyEmailComplete.bind(this));

        return router;
    }



    /**
     * @swagger
     * /users/{id}/profile:
     *   get:
     *     summary: Get user profile with companies
     *     tags:
     *       - Users
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *         description: User ID
     *     responses:
     *       200:
     *         description: User profile with companies
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 id:
     *                   type: string
     *                 email:
     *                   type: string
     *                 userName:
     *                   type: string
     *                 firstName:
     *                   type: string
     *                 lastName:
     *                   type: string
     *                 company:
     *                   type: string
     *                   nullable: true
     *                 configStep:
     *                   type: number
     *                 isActive:
     *                   type: boolean
     *                 createdAt:
     *                   type: string
     *                   format: date-time
     *                 updatedAt:
     *                   type: string
     *                   format: date-time
     *                 companies:
     *                   type: array
     *                   items:
     *                     type: object
     *                     properties:
     *                       id:
     *                         type: string
     *                       businessName:
     *                         type: string
     *                       status:
     *                         type: string
     *                         enum: [pending, accepted, inactive]
     *                       availableRoles:
     *                         type: array
     *                         items:
     *                           type: object
     *                           properties:
     *                             id:
     *                               type: string
     *                             name:
     *                               type: string
     *                             description:
     *                               type: string
     *       404:
     *         description: User not found
     */
    async getUserProfile(req: Request, res: Response) {
        try {
            const user = await this.companyUserService.getUserWithCompaniesByUserId(req.params.id);
            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }
            res.json(user);
        } catch (error) {
            res.status(500).json({ error: "Internal server error" });
        }
    }







    /**
     * @swagger
     * /users/{id}/profile:
     *   put:
     *     summary: Update user profile
     *     tags:
     *       - Users
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               userName:
     *                 type: string
     *               firstName:
     *                 type: string
     *               lastName:
     *                 type: string
     *               company:
     *                 type: string
     *               configStep:
     *                 type: integer
     *               isActive:
     *                 type: boolean
     *     responses:
     *       200:
     *         description: User profile updated
     *       404:
     *         description: User not found
     */
    async updateUser(req: Request, res: Response) {
        try {
            const updateData = updateUserSchema.parse(req.body);
            const user = await userService.updateUser(req.params.id, updateData);
            if (!user) {
                return res.status(404).json({error: "User not found"});
            }
            res.json(user);
        } catch (error) {
            res.status(400).json({error: "Invalid user data"});
        }
    }





    /**
     * @swagger
     * /users/{userId}/verify-email-complete:
     *   post:
     *     summary: Complete email verification process
     *     tags:
     *       - Users
     *     parameters:
     *       - in: path
     *         name: userId
     *         required: true
     *         schema:
     *           type: string
     *       - in: query
     *         name: language
     *         schema:
     *           type: string
     *           enum: [en, es]
     *           default: es
     *         description: Language for welcome email
     *     responses:
     *       200:
     *         description: Verification completed
     *       400:
     *         description: Invalid language parameter
     */
    async verifyEmailComplete(req: Request, res: Response) {
        try {
            const userId = req.params.userId;
            if (!userId) {
                return res.status(400).json({error: 'User ID is required'});
            }

            const userLanguage = req.query.language as string || 'es';
            if (!['en', 'es'].includes(userLanguage)) {
                return res.status(400).json({error: 'Language must be en or es'});
            }
            
            const result = await userService.verifyEmailComplete(userId, userLanguage);
            
            res.status(200).json(result);
        } catch (error: any) {
            console.error('Error processing email verification completion:', error);
            
            if (error.message === 'User not found in Cognito') {
                return res.status(404).json({error: error.message});
            }
            
            res.status(500).json({error: error.message || 'Failed to process verification completion'});
        }
    }
}
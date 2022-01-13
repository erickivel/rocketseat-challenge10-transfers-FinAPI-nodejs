import { Request, Response } from "express";
import { container } from "tsyringe";
import { CreateTransferUseCase } from "./CreateTransferUseCase";

class CreateTransferController {
    async execute(request: Request, response: Response): Promise<Response> {
        const { id: sender_user_id } = request.user;
        const { user_id: receiver_user_id } = request.params;
        const { amount, description } = request.body;

        const createTransferUseCase = container.resolve(CreateTransferUseCase);

        await createTransferUseCase.execute({
            amount,
            description,
            receiver_user_id,
            sender_user_id
        });

        return response.status(201).send();
    }
};

export { CreateTransferController };
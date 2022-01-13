import { inject, injectable } from "tsyringe";

import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { CreateTransferError } from "./CreateTransferError";
import { ICreateStatementDTO } from "../createStatement/ICreateStatementDTO";

interface IRequest {
    amount: number;
    description: string;
    receiver_user_id: string;
    sender_user_id: string;
};

@injectable()
class CreateTransferUseCase {
    constructor(
        @inject("UsersRepository")
        private usersRepository: IUsersRepository,
        @inject("StatementsRepository")
        private statementsRepository: IStatementsRepository
    ) { }

    async execute({ amount, description, receiver_user_id, sender_user_id }: IRequest): Promise<void> {
        const senderUser = await this.usersRepository.findById(sender_user_id);

        if (!senderUser) {
            throw new CreateTransferError.UserNotFound();
        };

        const receiverUser = await this.usersRepository.findById(receiver_user_id);

        if (!receiverUser) {
            throw new CreateTransferError.ReceiverUserNotFound();
        };

        const { balance } = await this.statementsRepository.getUserBalance({ user_id: sender_user_id });

        if (balance < amount) {
            throw new CreateTransferError.InsufficientFunds();
        }

        await this.statementsRepository.create({
            amount,
            description,
            type: "transfer",
            user_id: sender_user_id,
            sender_id: sender_user_id,
        } as ICreateStatementDTO);

        await this.statementsRepository.create({
            amount,
            description,
            type: "transfer",
            user_id: receiver_user_id,
            sender_id: sender_user_id,
        } as ICreateStatementDTO);
    };
};

export { CreateTransferUseCase };
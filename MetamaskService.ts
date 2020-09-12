import {erc20TokenContractAbi} from '@/constants';
import CommonSelectbox from '@/interfaces/CommonSelectbox';

export default class MetamaskService {
    public static getAmountMinusFee(amount: number) {

        if (amount <= 0)
            return 0;

        if (amount < 50) {
            return amount - amount * 0.1;
        }

        if (amount < 70) {
            return amount - amount * 0.08;
        }

        if (amount < 80) {
            return amount - amount * 0.07;
        }

        return amount - amount * 0.05;
    }

    private static getContractInstance(contractAddress: string){
        const tokenContract = new window.web3.eth.Contract(
            erc20TokenContractAbi,
            contractAddress
        );

        return tokenContract;
    }

    public async sendMoney(amount: number, sender: string, receiver: string, coin: (CommonSelectbox & {contractAddress: string})){

    }

    public static async getBalance(address: string, coin: (CommonSelectbox & {contractAddress: string})){
        if(coin.value === 'eth'){
            return MetamaskService.getEthBalancePromise(address)
        }

        return MetamaskService.getStableCoinBalancePromise(address, coin.contractAddress);
    }

    private static async getEthBalancePromise(address: string): Promise<number>{
        return new Promise((resolve,reject) => {
            window.web3.eth.getBalance(address, (err, result) => {
                const balance = window.web3.utils.fromWei(result, "ether");
                if(!err){
                    resolve(balance as number);
                }else{
                    reject(err)
                }
            });
        })
    }

    private static async getStableCoinBalancePromise(address: string, contractAddress: string): Promise<number>{
           const contract = MetamaskService.getContractInstance(contractAddress);
            return new Promise(async resolve => {
                const balance = await contract.methods.balanceOf(address).call();
                const decimals = await contract.methods.decimals().call();
                console.log(contract)
                 resolve(balance / (10**decimals))
            })
    }
}

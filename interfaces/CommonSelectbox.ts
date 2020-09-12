import Entity from "@/interfaces/Entity";

export default interface CommonSelectbox extends Entity{
    value: string;
    isAllowed: boolean;
    icon: string;
}

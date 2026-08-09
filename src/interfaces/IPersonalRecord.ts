export type TPersonalRecord = {
    weight: number;
    liftName: string;
};

export type TAddSetResponse = {
    newPr: boolean;
    weight?: number;
    liftName?: string;
};

// types/conference.ts
export type Conference = {
    id: number;
    title: string;
    description: string;
    date: string;
    startTime: string;
    endTime: string;
    room: {
        id: number;
        name: string;
    };
    sponsor?: {
        id: number;
        email: string;
    };
    speaker: {
        id: number;
        firstName: string;
        lastName: string;
        bio?: string;
    };
};

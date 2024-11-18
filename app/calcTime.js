import { format } from 'date-fns';


export default function calculateTimeDifference(createdAt) {
    const now = new Date();
    const invitationDate = new Date(createdAt);
    const diffInMs = now - invitationDate;
    const diffInMinutes = Math.floor(diffInMs / 60000);

    if (diffInMinutes < 1) {
        return "Just now";
    } else if (diffInMinutes < 60) {
        return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    } else if (diffInMinutes < 1440) {
        const hours = Math.floor(diffInMinutes / 60);
        return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
        const days = Math.floor(diffInMinutes / 1440);
        return `${days} day${days > 1 ? 's' : ''} ago`;
    }
}

export function calcCreatedAt(createdAt){
    const formattedDate = format(createdAt, 'MMM dd, yyyy');
    return formattedDate;
}

export function calculateTime(createdAt){
    const now = new Date();
    const messageDate = new Date(createdAt);
    const diffInMs = now - messageDate;
    const diffInMinutes = Math.floor(diffInMs / 60000);
    if(diffInMinutes > 525600){
        const formattedDate = format(new Date(createdAt), 'MMM dd, yyyy HH:mm');
        return formattedDate;
    }else if(diffInMinutes > 1440){
        const formattedDate = format(new Date(createdAt), 'MMM dd, HH:mm');
        return formattedDate;
    }else{
        const formattedDate = format(new Date(createdAt), ' HH:mm');
        return formattedDate;
    }

}

const calcAge = (birthDate) => {
    const now = new Date();
    const birth = new Date(birthDate); // تحويل تاريخ الميلاد إلى كائن Date

    let age = now.getFullYear() - birth.getFullYear(); // حساب الفرق بين السنوات
    const monthDifference = now.getMonth() - birth.getMonth(); // حساب الفرق بين الشهور

    // إذا كان الشهر الحالي أقل من شهر الميلاد أو إذا كنا في نفس الشهر ولكن اليوم الحالي أقل من يوم الميلاد، نقص سنة من العمر
    if (monthDifference < 0 || (monthDifference === 0 && now.getDate() < birth.getDate())) {
        age--;
    }

    return age;
}

import { Icon } from '@iconify-icon/react'
import { ReactNode } from 'react'

interface AuthLayoutProps {
    children: ReactNode
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
    return (
        <div className='poppins-regular bg-primary-background h-screen w-full flex justify-center items-center'>
            <div className='absolute w-full top-6 flex justify-between px-10'>
                <h1 className='text-2xl font-bold text-primary'>Avoda</h1>
                <h1 className='flex items-center justify-center gap-1 cursor-pointer'>
                    <Icon icon="weui:setting-filled" width="24" height="24" />
                    Need Help?
                </h1>
            </div>
            {children}

        </div>
    );
};

export default AuthLayout;

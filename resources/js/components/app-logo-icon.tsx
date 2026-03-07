import type { ImgHTMLAttributes } from 'react';

export default function AppLogoIcon(props: ImgHTMLAttributes<HTMLImageElement>) {
    return (
        <div className='w-full h-full flex items-center justify-center'>
            <img
            {...props}
            src="/images/2M-LOGO.png"
            alt={props.alt ?? '2M Logo'}
            
        />
        </div>
    );
}

import type { ImgHTMLAttributes } from 'react';

export default function AppLogoIcon(props: ImgHTMLAttributes<HTMLImageElement>) {
    return (
        <img
            {...props}
            src="/images/2M-LOGO.png"
            alt={props.alt ?? '2M Logo'}
        />
    );
}

import {PolymorphicComponent} from '../../Ui/Primitives/AppBox';
import { ComponentProps } from 'react';
import { ICON_NAME } from '../Icon/Icon';

declare const Button: PolymorphicComponent<ComponentProps<"button"> & {
    size?: 'small' | 'medium' | 'big',
    leftIcon?: keyof typeof ICON_NAME,
    rightIcon?: keyof typeof ICON_NAME,
    alternative?: boolean,
    variant: 'primary' | 'secondary' | 'tertiary' | 'link',
    variantColor?: 'primary' | 'danger'
}>

export default Button
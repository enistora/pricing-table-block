import { registerBlockType } from '@wordpress/blocks';
import Edit from './edit';
import save from './save';
import './style.css';

registerBlockType('pricing-table-block/main', {
    edit: Edit,
    save,
});
import React,{ useContext, useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import { faCartShopping, faTrashCan } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import CartContext from '../../context/CartContext'

import Menu from '@mui/material/Menu';
import { Link } from 'react-router-dom';


/*Firebase*/
import db,{ app } from '../../utils/firebase';
import { collection, getDocs, query, where  } from 'firebase/firestore';
import { async } from '@firebase/util';

import LoginContext from '../../context/LoginContext';


const CartWidget = () =>{

    const { userProvider } = useContext(LoginContext);



    /*Cart context*/
    const { cartWidgetItems, removeCartItem, cartItemCount, setCartWidgetItems, clearCartWidget } = useContext(CartContext);

    /*Menu de CartWidget*/
    const [anchorCartWidget, setAnchorCartWidget] = React.useState(null);
    const openCartWidget = Boolean(anchorCartWidget);


    const handleOpenCartWidget = (event) => {
        setAnchorCartWidget(event.currentTarget);
        getWidget()
    };

    const handleCloseCartWidget = () => {
        setAnchorCartWidget(null);
    };


    const getWidget = async() => {
        const cartsCollection = collection(db, 'carritos');
        const cartsList = await getDocs(cartsCollection)
        
        cartsList.docs.forEach(( cart )=>{
            if( cart.id == userProvider.mail ){

                const cartProductsArray = Object.values( cart.data() );
        
                setCartWidgetItems( cartProductsArray )

            }

        })
    }   

    return(
        <>
            <Button onClick={handleOpenCartWidget} startIcon={<FontAwesomeIcon icon={ faCartShopping } />}  className='header-container__links-btn'>
                <p>{ cartItemCount() }</p>
            </Button>

            {/*MENU*/}

            <Menu id="basic-menu" anchorEl={anchorCartWidget} open={openCartWidget} onClose={handleCloseCartWidget}
            MenuListProps={{
                'aria-labelledby': 'basic-button',
            }}>
                <div className='cartWidget-container'>
                    {
                        cartWidgetItems<=0 ? (
                            <p>No hay productos en el carrito</p>

                        ) : (

                            <>
                            {
                            cartWidgetItems.map(( cartWidgetItem )=>{
                                return(
                                    <div key={cartWidgetItem.id} className='cartWidget-container__item' onClick={handleCloseCartWidget}>
                                        <p>{cartWidgetItem.title}</p>
                                        <p>Price: {cartWidgetItem.price}</p>
                                        <p>Stock:{cartWidgetItem.stockCount}</p>
                                        <Button onClick={ () => { removeCartItem(cartWidgetItem.id) } }> 
                                            <FontAwesomeIcon icon={ faTrashCan }/>
                                        </Button>
                                    </div>
                                )
                            })
                            } 

                            <div className='header-container__pay'>
                                <Button onClick={ handleCloseCartWidget }>
                                    <Link to='/Cart'>
                                        Terminar compra
                                    </Link> 
                                </Button>
                            </div>     
                            </>
                        )
                    }
                </div>
            </Menu>
        </>
            
        
    )
}

export default CartWidget;
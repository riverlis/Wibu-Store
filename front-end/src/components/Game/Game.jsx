import React, { useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

import "./Game.css";
import { checkSession, fetchGameInfor, fetchUserInfor, logout } from "../../support";

import logo from "../../assets/logo.png";
import cartBtnSymbol from "../../assets/cart_button.png";
import cartBtnHoverSymbol from "../../assets/cart_button_hover.png";
import Loading from "../Loading/Loading";

import starSymbol from "../../assets/star.png";
import halfStarSymbol from "../../assets/half-star.png";
import fullStarSymbol from "../../assets/full-star.png";

import cartSymbol from "../../assets/cart.png";
import giftSymbol from "../../assets/gift.png";
import loveSymbol from "../../assets/love.png";

import cartHoverSymbol from "../../assets/cart_hover.png";
import giftHoverSymbol from "../../assets/gift_hover.png";
import loveHoverSymbol from "../../assets/love_hover.png";
import Details from "./Details/Details";
import Reviews from "./Reviews/Reviews";
import Checkout from "../Checkout/Checkout";

import closeSymbol from "../../assets/close-icon.png";

const Game = () => {

    const navigate = useNavigate();

    const [isHoveringOtherBtn, setIsHoveringOtherBtn] = useState(-1);
    const [isHoveringCartBtn, setIsHoveringCartBtn] = useState(false);

    const [isLoading, setIsLoading] = useState(true);

    const [gameInfor, setGameInfor] = useState(null);

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [avatar, setAvatar] = useState(null);

    const [isBigEnough, setIsBigEnough] = useState(true);

    const { gameID } = useParams();

    const [pointStars, setPointStars] = useState([Array(5).fill(0)]);

    const [currentTab, setCurrentTab] = useState(0);

    const [isPaying, setIsPaying] = useState(false);

    function handleResize() {
        if (window.innerWidth < 0.7 * window.screen.width) {
            setIsBigEnough(false);
        } else {
            setIsBigEnough(true);
        }
    }

    function handleOtherButtonHover(id) {
        setIsHoveringOtherBtn(id);
    }

    function handleOtherButtonLeave() {
        setIsHoveringOtherBtn(-1);
    }

    useEffect(() => {
        (async () => {
            try {
                if (isLoading) {
                    // Load data
                    setGameInfor(await fetchGameInfor(gameID));
                    const point = gameInfor.avg_point;
                    const points = Array(5).fill(0);
                    for (let i=0; i<Math.floor(point); i++) {
                        points[i] = 1;
                    }

                    if (0.8 >= (point - Math.floor(point)) && (point - Math.floor(point))  >= 0.3) points[Math.floor(point)] = 0.5;
                    else if (point - Math.floor(point) > 0.7) points[Math.floor(point)] = 1;
                    setPointStars(points);

                    // check session
                    const session = await checkSession();
                    if (session.result) {
                        setAvatar(await fetchUserInfor(session.uid, "avatar"));
                        
                        setIsLoggedIn(true);
                    }

                    setIsLoading(false);
                }
            } catch (error) {
                console.log(error);
            }
        }) ();
    })
    
    window.addEventListener('resize', handleResize);

    const headerCategories = ["Latest", "Genre", "Collection", "Deal"];
    
    if (isLoading) return <Loading />;
    else return (
        <div className="Game">
            <div className="header-container">
                {isBigEnough ? 
                    <div className="store-logo">Wibu <img src={logo} alt="" className="logo" /> Store</div>: 
                    <div className="store-logo"><img src={logo} alt="" className="logo" /></div>}

                <div className="header-categories-container">
                    {headerCategories.map((category, index) => (
                        <div className="header-category" key={index}>{category}</div>
                    ))}
                </div>

                <div className="search-bar">
                    <input type="text"
                        placeholder="Search"
                    />
                </div>

                <div className="cart"
                    onMouseEnter={() => {setIsHoveringCartBtn(true)}}
                    onMouseLeave={() => {setIsHoveringCartBtn(false)}}>
                    {isHoveringCartBtn ? <img src={cartBtnHoverSymbol} alt="cart" /> : <img src={cartBtnSymbol} alt="cart" />}
                </div>

                {isLoggedIn ? 
                    <div className="avatar-container" onClick={async () => {await logout(); navigate(0)}}>
                        <img src={`data:image/jpeg;base64,${avatar}`} className="avatar" alt="" />
                    </div> :
                    <div className="login-button" onClick={() => {navigate('/login')}}>Login</div>}
            </div>

            <div className="main-content-container">
                <div className="data-container">
                    <div className="background-img">
                        {/* <img src={`data:image/jpeg;base64,${gameInfor.cover_img}`} alt="" /> */}
                    </div>

                    <div className="main-infor">
                        <div className="cover-img">
                            <img src={`data:image/jpeg;base64,${gameInfor.cover_img}`} alt="" />
                        </div>
                        <div className="game-infor">
                            <div className="game-title">{gameInfor.title}</div>
                            <div className="publisher">{gameInfor.publisher.toUpperCase()}</div>
                            <div className="developers">
                                {gameInfor.developers.map((dev, index) => (
                                    <div key={index}>
                                        {dev}
                                        {index !== gameInfor.developers.length - 1 && <span>;</span>}
                                    </div>
                                ))}
                            </div>

                            <hr style={{boxShadow: "none", border: "1px solid white", width: "100%", borderRadius: "1px", margin: "20px 0"}} />

                            <div style={{display: "flex", flexDirection: "column", flexGrow: "1", justifyContent: "space-between"}}>
                                <div style={{display: "flex", flexDirection: "row"}}>
                                    <div style={{display: "flex", flexDirection: "column", alignItems: "center", marginRight: "10px"}}>
                                        <div style={{marginTop: "7px", fontWeight: "600", fontSize: "1rem"}}>Size</div>
                                        <div style={{marginTop: "auto", marginBottom: "7px"}}>{Math.round(gameInfor.size)} GB</div>
                                    </div>

                                    <div style={{marginLeft: "auto"}}>
                                        <div>In-game purcharses available</div>
                                        <div>Online play required</div>
                                        <div>Co-op</div>
                                    </div>
                                </div>
                                

                                <div className="point-stars">
                                    {pointStars.map((pointStar, index) => {
                                        if (pointStar === 0) return <img key={index} src={starSymbol} alt="" />
                                        else if (0.4 <= pointStar && pointStar <= 0.6) return <img key={index} src={halfStarSymbol} alt="" />
                                        else return <img key={index} src={fullStarSymbol} alt="" />
                                    })}
                                    <div style={{marginLeft: "10px"}}>({gameInfor.reviews.length})</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="actions">
                    <div className="buy-btn" onClick={() => {if (isLoggedIn) setIsPaying(true); else navigate("/login") ;}}>
                        <div style={{fontWeight: "600"}}>Buy</div>
                        <div>${gameInfor.price}</div>
                    </div>

                    <div style={{marginLeft: "10px"}}>or</div>

                    <div style={{display: "flex"}} className="other-btns">
                        <div id="cart-btn" 
                            onMouseEnter={() => {handleOtherButtonHover(0)}}
                            onMouseLeave={handleOtherButtonLeave}>
                            {(isHoveringOtherBtn === 0) ? <img src={cartHoverSymbol} alt="" /> : <img src={cartSymbol} alt="" />}
                        </div>
                        <div id="gift-btn"
                            onMouseEnter={() => {handleOtherButtonHover(1)}}
                            onMouseLeave={handleOtherButtonLeave}>
                            {isHoveringOtherBtn === 1 ? <img src={giftHoverSymbol} alt="" /> : <img src={giftSymbol} alt="" />}
                            </div>
                        <div id="love-btn"
                            onMouseEnter={() => {handleOtherButtonHover(2)}}
                            onMouseLeave={handleOtherButtonLeave}>
                            {isHoveringOtherBtn === 2 ? <img src={loveHoverSymbol} alt="" /> : <img src={loveSymbol} alt="" />}
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="details-reviews-container">
                <div style={{width: "70%", display: "flex", flexDirection: "column"}}>
                    <div className="tags-container">
                        {["Details", "Reviews", "More"].map((tabName, index) => {
                            return <div key={index} className={`${tabName.toLowerCase()}-tag tag`} onClick={() => {setCurrentTab(index)}}>
                                <div>{tabName}</div>
                                <span className={`tag-switch-tab ${(index === currentTab) ? "current-tag" : ""}`}></span>
                            </div>
                        })}
                    </div>

                    {(currentTab === 0) && <Details description={gameInfor.description} />}
                    {(currentTab === 1) && <Reviews avg_point={gameInfor.avg_point} reviews={gameInfor.reviews} pointStars={pointStars} />}
                </div>
            </div>

            {(isPaying === true) && <div className="is-paying">
                <div 
                    style={{
                        display: "flex", 
                        width: "41%", 
                        height: "41%",
                        backgroundColor: "white",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "10px"
                    }}>
                    <div className="close-btn" onClick={() => {setIsPaying(false)}}>
                        <img src={closeSymbol} alt="" />
                    </div>
                    <Checkout gameInfor={gameInfor} />
                    <div className="order-summary">
                        <div className="order-summary-title">Order Summary</div>
                        <div className="order-summary-cover-img">
                            <img src={`data:image/jpeg;base64,${gameInfor.cover_img}`} alt="" />
                        </div>
                        <div style={{backgroundColor: "white"}}>
                            <div className="order-summary-game-title">{gameInfor.title}</div>
                            <div>Price: {gameInfor.price}$</div>
                        </div>
                    </div>
                </div>
            </div>}
        </div>
    )
};

export default Game;
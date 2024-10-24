import { useState } from "react";
import css from "./RestUserReviewedCard.module.css";
import downArrowImg from "/icons/down-arrow.png";
import starImg from "/icons/star.png";
import shareImg from "/icons/share.png";
import likeImg from "/icons/like.png";
import likedImg from "/icons/liked.png";
import comment from "/icons/message.png";
import close from "/icons/close.png";
import RatingNumberBox from "../RatingNumberBox/RatingNumberBox";
import WhiteBtnHov from "../../Buttons/WhiteBtnHov/WhiteBtnHov";
import RedBtnHov from "../../Buttons/RedBtnHov/RedBtnHov";
import profilepic from "/images/profilepic.jpg";

const RestUserReviewedCard = (props) => {
  const { imgSrc, name, stars, comment } = props.data;
  const [alertBoxCss, setAlertBoxCss] = useState(
    [css.alertBox, css.dnone].join(" ")
  );
  const [liked, setLiked] = useState(false);
  const [toggleDropDown, setToggleDropDown] = useState(false);
  const [toggleCommentBox, setToggleCommentBox] = useState(false);
  const [following, setFollowing] = useState(false);

  const toggleDropdown = () => {
    setToggleDropDown((val) => !val);
  };

  const shareURL = () => {
    navigator.clipboard.writeText(document.URL);
    setAlertBoxCss(css.alertBox);
    setTimeout(() => {
      setAlertBoxCss([css.alertBox, css.dnone].join(" "));
    }, 5000);
  };

  const closeAlert = () => {
    setAlertBoxCss([css.alertBox, css.dnone].join(" "));
  };

  return (
    <>
      <div className={alertBoxCss}>
        <span>Review link copied to clipboard</span>{" "}
        <span onClick={closeAlert}>
          <img src={close} alt="close button" className={css.closeImg} />
        </span>
      </div>
      <div className={css.outerDiv}>
        <div className={css.innerDiv}>
          <div className={css.sec1}>
            <div className={css.leftBox}>
              <div className={css.imgBox}>
                <img className={css.hotelImg} src={imgSrc} alt="hotel image" />
              </div>
              <div className={css.txtBox1}>
                <div className={css.title}>{name}</div>
              </div>
            </div>
          </div>
          <div className={css.sec}>
            <span className={css.delivery}>
              <RatingNumberBox
                stars={stars}
                txt={stars}
                iconR={false}
                isActive={true}
              />
            </span>
          </div>
          <p>{comment}</p>
        </div>
      </div>
    </>
  );
};

export default RestUserReviewedCard;

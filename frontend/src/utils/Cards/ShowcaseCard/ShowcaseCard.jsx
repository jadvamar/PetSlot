import { Link } from "react-router-dom";
import css from "./ShowcaseCard.module.css";
import star from "/icons/star.png";

let ShowcaseCard = (props) => {
  const {
    id,
    name,
    rating,
    imgSrc,
    address,
    // Keeping these props in case you want to use them in the future
    location,
    promoted,
    time,
    offB,
    proExtraB,
    off,
    proExtra,
  } = props;

  // You might want to generate this dynamically based on the shop's data
  // let link = "/" + "hyderabad/paraside/order";
  let link = `/order/${id}`;
  return (
    <Link className={css.outerDiv} to={link}>
      <div className={css.innerDiv}>
        <div className={css.imgBox}>
          {promoted && <div className={css.promoted}>Promoted</div>}
          <img className={css.img} src={imgSrc} alt={`${name} image`} />
          {offB && <div className={css.off}>{off}% OFF</div>}
          {proExtraB && (
            <div className={css.offPro}>Pro extra {proExtra}% OFF</div>
          )}
        </div>
        <div className={css.txtBox}>
          <div className={css.titleBox}>
            <div className={css.title}>{name}</div>
            <div className={css.title}>{id}</div>
            <div className={css.ratingBox}>
              {rating} <img className={css.star} src={star} alt="rating star" />
            </div>
          </div>
          <div className={css.tagBox}>
            <div className={css.tagTitle}>{address}</div>
            <button className={css.bookButton}>Book Slot</button>
          </div>
        </div>
        <div className={css.footer}>
          {/* Footer content can be added here if needed */}
        </div>
      </div>
    </Link>
  );
};

export default ShowcaseCard;

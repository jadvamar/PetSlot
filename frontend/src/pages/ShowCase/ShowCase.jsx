import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import Collections from "../../components/HomeComponents/Collections/Collections";

import NavigationBar2 from "../../components/Navbars/NavigationBar2/NavigationBar2";
import CategorySelectionComp from "../../utils/OrderingUtils/CategorySelectionComp/CategorySelectionComp";
import FilterBox from "../../utils/OrderingUtils/FilterBox/FilterBox";
import CircleCard1 from "../../utils/Cards/CircleCards/CircleCard1/CircleCard1";
import CircleCard2 from "../../utils/Cards/CircleCards/CircleCard2/CircleCard2";
import ShowcaseCard from "../../utils/Cards/ShowcaseCard/ShowcaseCard";
import ExploreOptionsNearMe from "../../components/HomeComponents/ExploreOptionsNearMe/ExploreOptionsNearMe";
import Footer from "../../components/Footer/Footer";
import CarouselUtil from "../../utils/CarouselUtil/CarouselUtil";

import delivery1 from "/icons/delivery1.png";
import delivery2 from "/icons/delivery2.png";
import filtersIcon from "/icons/filter.png";
import deliveryTimeIcon from "/icons/delivery-time.png";
import downArrowIcon from "/icons/down-arrow.png";

import {
  orderOnlinePage,
  diningOutPage,
  nightLifePage,
} from "../../helpers/constants";

import css from "./ShowCase.module.css";

let ShowCase = () => {
  useEffect(() => {}, []);
  const [shops, setShops] = useState({ shops: [], location: "" });
  let location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const page = urlParams.get("page");
  const selectedLocation = urlParams.get("location");

  console.log(selectedLocation);

  let [isActive, setIsActive] = useState({
    delivery: page === orderOnlinePage,
    dinning: page === diningOutPage,
    nightlife: page === nightLifePage,
  });
  let filterBoxes;

  let filters = {
    delivery: [
      { text: "Filter", leftIcon: filtersIcon },
      { text: "Delivery Time", leftIcon: deliveryTimeIcon },
      { text: "Pure Veg" },
      { text: "Rating: 4.0+" },
      { text: "Freate Offers" },
      { text: "Cuisines", leftIcon: downArrowIcon },
    ],
  };
  if (page === orderOnlinePage) {
    filterBoxes = filters?.delivery?.map((val, id) => {
      return (
        <div key={id}>
          <FilterBox
            leftIcon={val?.leftIcon ?? null}
            rightIcon={val?.rightIcon ?? null}
            text={val.text}
          />
        </div>
      );
    });
  } else if (page === diningOutPage) {
    filterBoxes = filters?.dinning?.map((val, id) => {
      return (
        <div key={id}>
          <FilterBox
            leftIcon={val?.leftIcon ?? null}
            rightIcon={val?.rightIcon ?? null}
            text={val.text}
          />
        </div>
      );
    });
  } else if (page === nightLifePage) {
    filterBoxes = filters?.nightLife?.map((val, id) => {
      return (
        <div key={id}>
          <FilterBox
            leftIcon={val?.leftIcon ?? null}
            rightIcon={val?.rightIcon ?? null}
            text={val.text}
          />
        </div>
      );
    });
  }

  return (
    <div className={css.outerDiv}>
      <NavigationBar2 setShops={setShops} />
      <div className={css.innerDiv}>
        <div className={css.breadcrumb}>{selectedLocation}</div>
      </div>
      <div className={css.showCaseDiv}>
        <div className={css.showcaseComps}>
          <CategorySelectionComp
            title="Delivery"
            imgSrc={delivery1}
            imgSrc2={delivery2}
            color="#FCEEC0"
            comp="delivery"
            isActive={isActive}
            setIsActive={setIsActive}
          />
          {/* <CategorySelectionComp
            title="Dinning"
            imgSrc={dinning1}
            imgSrc2={dinning2}
            color="#EDF4FF"
            comp="dinning"
            isActive={isActive}
            setIsActive={setIsActive}
          />
          <CategorySelectionComp
            title="NightLife"
            imgSrc={nightlife1}
            imgSrc2={nightlife2}
            color="#EDF4FF"
            comp="nightlife"
            isActive={isActive}
            setIsActive={setIsActive}
          /> */}
        </div>
      </div>
      {page !== orderOnlinePage ? (
        <div className={css.innerDiv2}>
          <div className={css.w7}>
            <Collections />
          </div>
        </div>
      ) : null}
      <div className={css.innerDiv3}>
        <div className={css.filtersDiv}>{filterBoxes}</div>
      </div>
      {/* {page === orderOnlinePage ? <div className={css.innerDiv4}>
            <div className={css.w7}>
                <div className={css.innerDiv4Title}>
                    Inspiration for your first order
                </div>
                <div className={css.rollerCarosuel}>
                    <CarouselUtil>
                        {foodCardScroll?.map((val, id) => {
                            return <div className={css.cardW} key={id}>
                                <CircleCard1 imgSrc={val.imgSrc} name={val.name} />
                            </div>
                        })}
                    </CarouselUtil>
                </div>
            </div>
        </div> : null} */}
      {/* {page === orderOnlinePage ? (
        <div className={css.innerDiv5}>
          <div className={css.w7}>
            <div className={css.innerDiv5Title}>Top brands for you</div>
            <div className={css.rollerCarosuel}>
              <CarouselUtil>
                {brandsCardScroll?.map((val, id) => {
                  return (
                    <div className={css.cardW} key={id}>
                      <CircleCard2
                        imgSrc={val.imgSrc}
                        name={val.name}
                        time={val.time}
                      />
                    </div>
                  );
                })}
              </CarouselUtil>
            </div>
          </div>
        </div>
      ) : null} */}
      <div className={css.innerDiv6}>
        <div className={css.w7}>
          <div className={css.innerDiv6Title}>
            {/* {page === orderOnlinePage
              ? "Shops in " 
              : page === diningOutPage
              ? "Dine-Out Restaurants in Gachibowli"
              : "Nightlife Restaurants in Gachibowli"} */}
            Shops in {shops.location}
          </div>
          <div className={css.innerDiv6Body}>
            {shops.shops?.map((shop, id) => {
              return (
                <ShowcaseCard
                  key={shop.id}
                  id={shop.id}
                  //   promoted={item.promoted}
                  //   time={item.time}
                  //   offB={item.offB}
                  // proExtraB={item.proExtraB}
                  // off={item.off}
                  // proExtra={item.proExtra}
                  name={shop.name}
                  rating={shop.rating || "4.2"}
                  imgSrc={`data:image/jpeg;base64,${shop.photo}`}
                  address={shop.address}
                  location={location}
                />
              );
            })}
          </div>
        </div>
      </div>
      {/* <ExploreOptionsNearMe /> */}
      <Footer />
    </div>
  );
};

export default ShowCase;

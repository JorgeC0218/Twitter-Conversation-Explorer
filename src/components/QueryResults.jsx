import React from 'react';
import Slider from 'react-slick';
import { Button, CardPanel } from 'react-materialize';
import { connect } from 'react-redux';
import firebase from '../firebase';
import embed from '../firebase/embed';
import './QueryResults.css';
import ChartComponent from '../chartComponents';
import CarouselChart from '../chartWrappers/CarouselChart';

const PrevButton = (props) => {
  return (
    <Button floating large icon="arrow_back" id="carousel-prev" className="tangerine" onClick={props.onClick} />
  );
};

const NextButton = (props) => {
  return (
    <Button floating large icon="arrow_forward" id="carousel-next" className="tangerine" onClick={props.onClick} />
  );
};

const QueryResults = props =>
  ( 
    props.results.length
      ? (
        <div id="results-carousel">
          <Slider adaptiveHeight={false} dots prevArrow={<PrevButton />} nextArrow={<NextButton />} >
            {
              props.results.map(ChartComponent(CarouselChart(props.favouriteItem, props.embedItem, props.user), false))
            }
          </Slider>
        </div>
      )
      : (
        <CardPanel><h2 className="center-align">Welcome to Tweet Insight</h2></CardPanel>
      )
  )

const mapStateToProps = state => ({
  results: state.results,
  user: state.user,
});

const mapDispatchToProps = (dispatch) => {
  const changeResults = chartObject =>
    dispatch({
      type: 'RESULTS_CHANGE',
      chartObject,
      index: chartObject.resultsIndex,
    });
  return {
    embedItem: (chartObject) => {
      embed(chartObject)
        .then((embedId) => {
          changeResults({ ...chartObject, embedId });
        });
    },
    favouriteItem: (chartObject) => {
      if (chartObject.id) {
        firebase.database().ref(`/charts/${firebase.auth().currentUser.uid}/${chartObject.id}/favourited`).set(true)
          .then(() =>
            changeResults({ ...chartObject, favourited: true })
          );
      } else {
        const { resultsIndex, ...restOfObject } = { ...chartObject, favourited: true };
        firebase.database().ref(`/charts/${firebase.auth().currentUser.uid}`).push(restOfObject)
          .then(item => 
            changeResults({ ...chartObject, id: item.key, favourited: true })
          );
      }
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(QueryResults);

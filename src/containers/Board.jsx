import React from 'react';
import { connect } from 'react-redux';
import { Route, Switch, Redirect } from 'react-router-dom';
import { Card, Row, Col, Button } from 'react-materialize';
import ChartComponent from '../chartComponents';
import BoardChart from '../chartWrappers/BoardChart';
import BoardPinModal from '../components/BoardPinModal';


const Board = props => (
  <Row>
    <Row>
      <Button onClick={() => props.deleteBoard(props.boardName) && <Redirect to="/" />}>Delete Board</Button>
      <h1 style={{ textAlign: 'center' }}>{props.boardName}</h1>
    </Row>
    {props.columns.map(column =>
      (<Col m={4}>
        <Card horizontal title={<div style={{ textAlign: 'center' }}>{column.name}</div>}>
          <Row>
            {column.charts.map(ChartComponent(BoardChart(props.boardName, props.favourite, props.unfavourite, props.deleteChart, props.moveChart, column.name, BoardPinModal)))}
          </Row>
        </Card>
      </Col>),
    )}
  </Row>
);

const mapStateToProps = (state, props) => {
  const boardName = props.match.params.boardName;
  return {
    boardName,
    columns: state.boards[boardName].columnNames.map((name, index) =>
      ({
        name,
        charts: state.boards[boardName].charts.filter(chart => chart.colIndex === index).map(chart => state.charts[chart.id]),
      }),
    ),
  };
};

const mapDispatchToProps = (dispatch, props) => ({
  favourite: id => dispatch({ type: 'FAVOURITES_ADD', id }),
  unfavourite: id => dispatch({ type: 'FAVOURITES_DELETE', id }),
  deleteChart: (id, boardName) => dispatch({ type: 'BOARD_CHART_DELETE', id, boardName }),
  moveChart: (id, boardName, columnName) => dispatch({ type: 'BOARD_MOVE_COLUMN', id, boardName, columnName }),
  deleteBoard: boardName => dispatch({ type: 'BOARD_DELETE', boardName }),
  pinToBoard: (id, boardName) =>
    props.boardNames.includes(boardName)
    && !props.boardContents[boardName].includes(id)
    && dispatch({ type: 'BOARD_CHART_ADD', id }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Board);


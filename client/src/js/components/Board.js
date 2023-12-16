import React, { useState, useEffect } from 'react';
import { Alert, Button, Col, Container, Row, Table } from 'react-bootstrap';

import { getPaddingStyle } from '../utils/style';

export default function Board(props) {
  // const tileBackgroundStyle = (i, j) => ((i + j) % 2 == 1) ? ({backgroundColor: 'green', opacity: 0.8}) : {};
  return (
    <Container>
      <Row>
        <Col xs={12} style={getPaddingStyle(20)} />
      </Row>
      <Row>
        <Table bordered >
          <tbody >
            {buildSampleBoardInfo().map((row, i) =>
              <tr key={i} >
                {row.map((col, j) =>
                  <td style={getTileBackgroundStyle(i, j)} key={j}>
                    <div style={{aspectRatio: 1 / 1}}>{col}</div>
                  </td>
                )}
              </tr>
            )}
          </tbody>
        </Table>
      </Row>
    </Container>
  );
}

function getTileBackgroundStyle(rowIdx, colIdx) {
  let style = {
    opacity: 0.8
  };
  style['backgroundColor'] = (rowIdx + colIdx) % 2 == 1 ? 'green' : 'white';
  return style;
}

function buildSampleBoardInfo() {
  const cols = 'abcdefgh';
  let boardInfo = [];
  for (var i = 7; i >= 0; i--) {
    let row = [];
    for (var j = 1; j <= 8; j++) {
      row.push(cols[i] + j);
    }
    boardInfo.push(row);
  }
  return boardInfo;
}

class Tile {
  constructor(){}
}


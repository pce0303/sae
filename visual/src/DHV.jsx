import { useEffect } from 'react';
import * as d3 from 'd3';
import PropTypes from 'prop-types';

const DHVisualization = ({ clientPublicKey = "", serverPublicKey = "", sharedKey = "", commitData = null }) => {
  useEffect(() => {
    const width = 600;
    const height = 400;
    
    const svg = d3.select('#dh-visualization')
      .attr('width', width)
      .attr('height', height)
      .style('border', '1px solid #000');

    // 타원으로 클라이언트와 서버 키를 표시
    svg.append('circle')
      .attr('cx', 150)
      .attr('cy', height / 2)
      .attr('r', 50)
      .style('fill', 'lightblue')
      .append('title')
      .text(`Client Public Key: ${clientPublicKey}`);

    svg.append('circle')
      .attr('cx', 450)
      .attr('cy', height / 2)
      .attr('r', 50)
      .style('fill', 'lightgreen')
      .append('title')
      .text(`Server Public Key: ${serverPublicKey}`);

    // 선으로 DH 키 교환을 시각화
    svg.append('line')
      .attr('x1', 200)
      .attr('y1', height / 2)
      .attr('x2', 400)
      .attr('y2', height / 2)
      .attr('stroke', 'black')
      .attr('stroke-width', 2);

    // 공유 키 결과
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', height - 50)
      .attr('font-size', 16)
      .attr('text-anchor', 'middle')
      .text(`Shared Key: ${sharedKey}`);

    // Commit 단계 시각화
    if (commitData) {
      svg.append('line')
        .attr('x1', 150)
        .attr('y1', height / 2 - 50)
        .attr('x2', 450)
        .attr('y2', height / 2 - 50)
        .attr('stroke', 'blue')
        .attr('stroke-width', 2)
        .style('stroke-dasharray', '5,5');

      svg.append('text')
        .attr('x', width / 2)
        .attr('y', height / 2 - 60)
        .attr('font-size', 12)
        .attr('text-anchor', 'middle')
        .text(`Commit Data: ${commitData.clientCommit} - ${commitData.serverCommit}`);
    }
  }, [clientPublicKey, serverPublicKey, sharedKey, commitData]);

  return (
    <svg id="dh-visualization"></svg>
  );
};

DHVisualization.propTypes = {
  clientPublicKey: PropTypes.string,
  serverPublicKey: PropTypes.string,
  sharedKey: PropTypes.string,
  commitData: PropTypes.shape({
    clientCommit: PropTypes.string,
    serverCommit: PropTypes.string
  })
};

export default DHVisualization;

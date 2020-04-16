'use babel';

import Chart from 'chart.js';

export default class AtomLoggerView {

  constructor(serializedState) {
    // Create root element
    this.element = document.createElement('div');
    this.element.classList.add('atom-logger');

    // Create message element
    const plot = document.createElement('canvas');
    plot.setAttribute('id', 'timeline');
    const ctx = plot.getContext('2d');
    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: [],
        datasets: [{
          label: "My timeline",
          data: [],
          fill: false,
        }],
      },
    });
    this.element.appendChild(plot);
  }

  // Returns an object that can be retrieved when package is activated
  serialize() {}

  // Tear down any state and detach
  destroy() {
    this.element.remove();
  }

  getElement() {
    return this.element;
  }

  setPoints(points) {
    let label = 5;
    const labels = points.reduce((acc, point) => {
      acc.push(label.toString());
      label += 5;
      return acc;
    }, []);
    this.chart.data = {
      labels: labels,
      datasets: [{
        label: "My timeline",
        fill: false,
        backgroundColor: 'rgb(255, 0, 0)',
        borderColor: 'rgb(0, 0, 255)',
        data: points,
        fill: false,
      }],
    },
    this.chart.update();
  }
}

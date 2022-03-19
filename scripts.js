let myData = '';
let numbers;
let years;
let dates;

fetch(
  'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json'
)
  .then(response => response.json())
  .then(data => (myData = JSON.stringify(data.data)))
  .then(() => {
    myData = JSON.parse(myData);
    numbers = myData.map(el => el[1]);
    dates = myData.map(el => el[0]);
    years = dates.map(el => new Date(el)); // converting to Date obj
    years = years.map(el => el.getYear() + 1900);
  })
  .then(() => {
    const svg = d3
      .select('svg')
      .style('background-color', 'white')
      .attr('width', 900)
      .attr('height', 500);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(numbers)])
      .range([400, 0]);
    const yAxis = d3.axisLeft(yScale);

    const barScale = d3
      .scaleLinear()
      .domain([0, d3.max(numbers)])
      .range([0, 400]);

    const xScale = d3
      .scaleLinear()
      .domain([d3.min(years), d3.max(years)])
      .range([0, 813]);
    const xAxis = d3.axisBottom(xScale).tickFormat(d3.format('d'));

    const xBarScale = d3
      .scaleLinear()
      .domain([0, numbers.length])
      .range([0, 813]);
    svg
      .append('text')
      .text('Gross Domestic Product')
      .attr('x', -250)
      .attr('y', 60)
      .attr('transform', 'rotate(-90)');

    svg
      .append('text')
      .text('More Information: http://www.bea.gov/national/pdf/nipaguid.pdf')
      .attr('transform', 'translate(300,480)');

    svg
      .selectAll('rect')
      .data(myData)
      .enter()
      .append('rect')
      .attr('x', (d, i) => xBarScale(i))
      .attr('y', (d, i) => 450 - barScale(d[1]) - 30)
      .attr('width', 2)
      .attr('height', (d, i) => barScale(d[1]))
      .attr('class', 'bar')
      .attr('transform', 'translate(40,0)')
      .attr('data-gdp', d => d[1])
      .attr('data-date', d => d[0])
      .append('title')
      .text(d => d[1]);

    svg.append('g').attr('transform', 'translate(40, 20)').call(yAxis);
    svg.append('g').attr('transform', 'translate(40, 420)').call(xAxis);
    const bars = document.getElementsByClassName('bar');

    for (var i = 0; i < bars.length; i++) {
      bars[i].addEventListener('mouseover', e => {
        const tooltip = document.getElementsByClassName('tooltip');
        tooltip[0].style.opacity = 1;
        tooltip[0].innerHTML = `<p>DATE: ${e.target.getAttribute(
          'data-date'
        )}</p> <p>GDP: ${e.target.getAttribute('data-gdp')}</p>`;
      });

      bars[i].addEventListener('mouseleave', e => {
        const tooltip = document.getElementsByClassName('tooltip');
        tooltip[0].style.opacity = 0;
      });
    }
  })
  .catch(err => console.log(err));

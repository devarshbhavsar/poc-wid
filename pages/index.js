import { useEffect, useState } from "react";
import { createDetailsWidget } from "@livechat/agent-app-sdk";

function getFileNameOnly(filePath) {
  return filePath.split('/').pop().split('.').shift();
}

function loadJson() {
  const requireContext = require.context('../public/cars', false, /\.json$/);
  const json = {};
  requireContext.keys().forEach((key) => {
    const obj = requireContext(key);
    const simpleKey = getFileNameOnly(key);
    json[simpleKey] = obj;
  });
  return json;
}

// Save list of cars from json files into cars variable
let myJson = loadJson();
var keys = [];
   for(var k in myJson) keys.push(k);
var cars = [];
for (var i = 0; i < keys.length; i++) {
  for (var j = 0; j < myJson[keys[i]].length; j++) {
    cars.push(myJson[keys[i]][j]);
  }
}

// Get smallest and largest years and make it into a list and get makes
var makes = [];
var minYear = Number.MAX_SAFE_INTEGER;
var maxYear = Number.MIN_SAFE_INTEGER;
var years = [];
for (var i = 0; i < cars.length; i++) {
  var car = cars[i];
  if (!makes.includes(car.make)) {
    makes.push(car.make);
  }
  if (car.year < minYear) {
    minYear = car.year;
  }
  if (car.year > maxYear) {
    maxYear = car.year;
  }
}
for (var i = minYear; i <= maxYear; i++) {
  years.push(i);
}

export default function Home() {
  const [widget, setWidget] = useState(null);
  const [selectedCars, setSelectedCars] = useState([]);
  const [filteredCars, setFilteredCars] = useState([...cars]);

  //useEffect(() => {
  //  createDetailsWidget().then((widget) => {
  //    setWidget(widget);
  //  })
  //}, []);

  const handlePutMessage= async() => {
    var richMessage = {
      "template_id": "cards",
      "elements": []
    }
    for (var index=0; index<selectedCars.length; index++) {
      richMessage.elements.push({
        "title": selectedCars[index].year + " " + selectedCars[index].make + " " + selectedCars[index].model + " " + selectedCars[index].trim,
        "subtitle": selectedCars[index].vehicleCondition + " " + selectedCars[index].exteriorColor + selectedCars[index].make + " " + selectedCars[index].model + " for sale",
        "image": {
          "url": selectedCars[index].images[0]
        },
        "buttons": [{
          "type": "url",
          "text": "Open link",
          "postback_id": "open_url",
          "user_ids": [],
          "value": selectedCars[index].images[0]
        },
        {
          "type": "message",
          "text": "Selected " + selectedCars[index].vin,
          "postback_id": "send_message",
          "user_ids": [],
          "value": "Selected " + selectedCars[index].vin
        }]
      })
    }

    const response = await fetch('https://poc-widget.vercel.app/api/message', {
      method: 'POST',
      body: JSON.stringify(richMessage),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json()
    console.log(data);
  }

  //if(widget === null) {
  //  return (
  //    <div className="text-center">
  //      <div className="spinner-border" role="status">
  //        <span className="sr-only">Loading...</span>
  //      </div>
  //    </div>
  //  );
  //}

  function addCar(car) {
    setSelectedCars([...selectedCars, car]);
  }

  function removeCar(car) {
    var temp = [...selectedCars];
    var index = temp.indexOf(car);
    temp.splice(index, 1);
    setSelectedCars(temp);
  }

  function isSelected(car) {
    var temp = [...selectedCars];
    var index = temp.indexOf(car);
    if (index > -1) {
      return true;
    }
    return false;
  }

  function resetFilters() {
    document.getElementById("selectMinYear").value = String(years[0]);
    document.getElementById("selectMaxYear").value = String(years[years.length-1]);
    document.getElementById("selectMake").value = "Choose...";
    document.getElementById("selectCondition").value = "Choose...";
    document.getElementById("vin").value = "";
    let checkboxes = document.querySelectorAll('input[name="feature"]:checked');
    checkboxes.forEach(checkbox => {
      checkbox.checked = false
    });
    var minYear = document.getElementById("selectMinYear").value;
    var maxYear = document.getElementById("selectMaxYear").value;
    setFilteredCars(cars.filter(car => (car.year >= minYear && car.year <= maxYear)));
  }

  function filterCars() {
    var minYear = document.getElementById("selectMinYear").value;
    var maxYear = document.getElementById("selectMaxYear").value;
    var make = document.getElementById("selectMake").value;
    var condition = document.getElementById("selectCondition").value;

    let checkboxes = document.querySelectorAll('input[name="feature"]:checked');

    let vin = document.getElementById("vin").value;

    if (vin == "") {
      if (make != "Choose..." && condition != "Choose...") {
        checkboxes.forEach((checkbox) => {
          setFilteredCars(cars.filter(car => (car.year >= minYear && car.year <= maxYear && car.make === make && car.vehicleCondition === condition &&
                                              car.featureMatch.categories.includes(checkbox.value))));
        });
        if (checkboxes.length == 0) {
          setFilteredCars(cars.filter(car => (car.year >= minYear && car.year <= maxYear && car.make === make && car.vehicleCondition === condition)));
        }
      }
      else if (condition != "Choose...") {
        checkboxes.forEach((checkbox) => {
          setFilteredCars(cars.filter(car => (car.year >= minYear && car.year <= maxYear && car.vehicleCondition === condition &&
                                              car.featureMatch.categories.includes(checkbox.value))));
        });
        if (checkboxes.length == 0) {
          setFilteredCars(cars.filter(car => (car.year >= minYear && car.year <= maxYear && car.vehicleCondition === condition)));
        }
      }
      else if (make != "Choose...") {
        checkboxes.forEach((checkbox) => {
          setFilteredCars(cars.filter(car => (car.year >= minYear && car.year <= maxYear && car.make === make &&
                                              car.featureMatch.categories.includes(checkbox.value))));
        });
        if (checkboxes.length == 0) {
          setFilteredCars(cars.filter(car => (car.year >= minYear && car.year <= maxYear && car.make === make)));
        }
      }
      else {
        checkboxes.forEach((checkbox) => {
          setFilteredCars(cars.filter(car => (car.year >= minYear && car.year <= maxYear &&
                                              car.featureMatch.categories.includes(checkbox.value))));
        });
        if (checkboxes.length == 0) {
          setFilteredCars(cars.filter(car => (car.year >= minYear && car.year <= maxYear)));
        }
      }
    } 
    else {
      setFilteredCars(cars.filter(car => (car.vin == vin)));
    }
  }

  return (
      <div className="container" style={{maxWidth:"100%"}}>
        <div className="row" style={{margin:"5px"}}>
          <button className="btn btn-primary" type="button" data-bs-toggle="collapse" data-bs-target="#filters" aria-expanded="false" aria-controls="filters">
            Filters
          </button>
          <div className="collapse" id="filters">
            <div className="card" style={{padding:"10px", marginBottom:"10px", marginTop:"10px"}}>
                <b>VIN:</b>
                <input type="text" id="vin" name="vin" />
            </div>

            <div className="card" style={{padding:"10px", marginBottom:"10px"}}>
              <div className="row row-cols-2">
                <div className="col">
                  <b>Min Year:</b>
                  <select className="custom-select" id="selectMinYear" defaultValue={minYear}>
                    {years.map((year, index) => (
                      <option key={index}>{year}</option>
                    ))}
                  </select>
                </div>
                <div className="col">
                  <b>Max Year:</b>
                  <select className="custom-select" id="selectMaxYear" defaultValue={maxYear}>
                    {years.map((year, index) => (
                      <option key={index}>{year}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="card" style={{padding:"10px", marginBottom:"10px"}}>
                <b>Make:</b>
                <select className="custom-select" id="selectMake" defaultValue="Choose...">
                  <option>Choose...</option>
                  {makes.map((make, index) => (
                    <option key={index}>{make}</option>
                  ))}
                </select>
            </div>

            <div className="card" style={{padding:"10px", marginBottom:"10px"}}>
                <b>Condition:</b>
                <select className="custom-select" id="selectCondition" defaultValue="Choose...">
                  <option>Choose...</option>
                  <option>New</option>
                  <option>Used</option>
                </select>
            </div>

            <div className="card" style={{padding:"10px", marginBottom:"10px"}}>
                <b>Features:</b>
                <label htmlFor="f1"> <input type="checkbox" name="feature" value="Bluetooth" id="f1" />  Bluetooth</label>
                <label htmlFor="f2"> <input type="checkbox" name="feature" value="Cooled Seats" id="f2" />  Cooled Seats</label>
                <label htmlFor="f3"> <input type="checkbox" name="feature" value="Heated Seats" id="f3" />  Heated Seats</label>
                <label htmlFor="f4"> <input type="checkbox" name="feature" value="Rear View Camera" id="f4" />  Rear View Camera</label>
                <label htmlFor="f5"> <input type="checkbox" name="feature" value="Sunroof" id="f5" />  Sunroof</label>
                <label htmlFor="f6"> <input type="checkbox" name="feature" value="Third Row Seats" id="f6" />  Third Row Seats</label>
            </div>

            <button type="button" className="btn btn-primary" onClick={filterCars} style={{width:"45%", margin:"5px"}}>Apply Filters</button>
            <button type="button" className="btn btn-secondary" onClick={resetFilters} style={{width:"45%", margin:"5px"}}>Reset Filters</button>
          </div>
        </div>

        <hr />

        <div className="row" style={{margin:"5px"}}>
          <button type="button" className="btn btn-success" onClick={handlePutMessage}>Send Carousel</button>
          <h4 style={{marginTop:"10px"}}>Selected Cars:</h4>
            <ul>
              {selectedCars.map((car, index) => (
                <li key={index}>{car.year + ' ' + car.make + ' ' + car.model + ' ' + car.trim}</li>
              ))}
            </ul>
        </div>
        
        <hr />
        
        <div className="row row-cols-1">
          {filteredCars.map((car, index) => (
            <div className="col" key={index}>
              <div className="card" style={{marginTop:"10px"}}>
                <div className="card-header">
                  <h5 className="card-title">{car.year + ' ' + car.make + ' ' + car.model + ' ' + car.trim}</h5>
                  <nav>
                    <ul className="nav nav-pills card-header-pills" data-bs-toggle="pills">
                      <li className="nav-item">
                        <a className="nav-link active" aria-current="true" data-bs-toggle="pill" href={"#info-"+car.vin}>Info</a>
                      </li>
                      <li className="nav-item">
                        <button className="nav-link" data-bs-toggle="pill" href={"#features-"+car.vin}>Features</button>
                      </li>
                      <li className="nav-item">
                        <button className="nav-link" data-bs-toggle="pill" href={"#details-"+car.vin}>Details</button>
                      </li>
                    </ul>
                  </nav>
                </div>
                <div className="card-body tab-content">
                  <div className="tab-pane active" id={"info-"+car.vin}>
                    <ul className="list-group list-group-flush">
                      <li className="list-group-item">
                        <div className="row row-cols-2">
                          <div className="col">
                            Condition:
                          </div>
                          <div className="col">
                            {car.vehicleCondition}
                          </div>
                        </div>
                      </li>
                      <li className="list-group-item">
                        <div className="row row-cols-2">
                          <div className="col">
                            Body Style:
                          </div>
                          <div className="col">
                            {car.bodyStyle}
                          </div>
                        </div>
                      </li>
                      <li className="list-group-item">
                        <div className="row row-cols-2">
                          <div className="col">
                            Color:
                          </div>
                          <div className="col">
                            {car.exteriorColor}
                          </div>
                        </div>
                      </li>
                      <li className="list-group-item">
                        <div className="row row-cols-2">
                          <div className="col">
                            Mileage:
                          </div>
                          <div className="col">
                            {car.mileage} mi
                          </div>
                        </div>
                      </li>
                      <li className="list-group-item">
                        <div className="row row-cols-2">
                          <div className="col">
                            Price:
                          </div>
                          <div className="col">
                            ${car.price}
                          </div>
                        </div>
                      </li>
                    </ul>
                  </div>

                  <div className="tab-pane" id={"features-"+car.vin}>
                    <p>Features: </p>
                    <ul>
                      {car.featureMatch.categories.map((feature, index) => (
                        <li key={index}>{feature}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="tab-pane" id={"details-"+car.vin}>
                    <p>{car.details.join(", ")}</p>
                  </div>

                  <div id={"image-"+car.vin} hidden={true}>
                    <picture>
                      <source srcSet={car.images[0]} type="image/webp" />
                      <img src={car.images[0]} className="card-img-top" alt="" />
                    </picture>
                  </div>
                  
                </div>

                <button type="button" hidden={isSelected(car)} className="btn btn-primary" onClick={() => addCar(car)}>Add Car</button>
                <button type="button" hidden={!isSelected(car)} className="btn btn-danger" onClick={() => removeCar(car)}>Remove Car</button>
              </div>
            </div>
          ))}
        </div>
    </div>
  )
}
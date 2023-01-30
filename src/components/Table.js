import { faker } from "@faker-js/faker";
import { shuffleNearest, addRandom, removeRandom } from "../utils/helpers";
import { CSVLink } from "react-csv";
import React, { useCallback, useState, useEffect, useRef } from "react";

const Table = () => {
  const [locale, setLocale] = useState("en");
  const [users, setUsers] = useState([]);
  const [seedInput, setSeedInput] = useState("");
  const [page, setPage] = useState(2);
  const [errorNum, setErrorNum] = useState(0);
  const inputRef = useRef();

  const createRandomUser = useCallback(() => {
    const randomUser = {
      id: faker.random.numeric(10),
      name: faker.name.fullName(),
      address: genAddress(),
      phone: faker.phone.number(),
    };
    let errorsChanced = errorNum;
    if (!Number.isInteger(errorNum)) {
      const chance = errorNum - Math.floor(errorNum);
      if (chance >= Math.random()) {
        errorsChanced = Math.ceil(errorNum);
      }
    }
    for (let i = 0; i < errorsChanced; i++) {
      const field = fieldChoice();
      if (field[1] === "name") {
        randomUser.name = funcChoice(field[0]);
      }
      if (field[1] === "address") {
        randomUser.address = funcChoice(field[0]);
      }
      if (field[1] === "phone") {
        randomUser.phone = funcChoice(field[0]);
      }
    }

    function funcChoice(field) {
      const choice = Math.random() * 3;
      if (choice <= 1) {
        return removeRandom(field);
      } else if (choice <= 2) {
        return addRandom(field, locale);
      } else {
        return shuffleNearest(field);
      }
    }

    function fieldChoice() {
      const choice = Math.random() * 3;
      if (choice <= 1) {
        return [randomUser.name, "name"];
      } else if (choice <= 2) {
        return [randomUser.address, "address"];
      } else {
        return [randomUser.phone, "phone"];
      }
    }

    function genAddress() {
      let address;
      const choice = Math.random() * 3;
      if (choice <= 1) {
        address = `${faker.address.streetAddress(
          true
        )}, ${faker.address.cityName()}`;
      } else if (choice <= 2) {
        address = `${faker.address.cityName()}, ${faker.address.street()}, ${faker.address.buildingNumber()}, ${faker.address.zipCode()}`;
      } else {
        address = `${faker.address.buildingNumber()}, ${faker.address.street()}, ${faker.address.city()}, ${faker.address.zipCode()}`;
      }
      return address;
    }
    return randomUser;
  }, [errorNum, locale]);

  const generateUsers = useCallback(
    (length) => {
      const usersNew = [];
      Array.from({ length: length }).forEach(() => {
        usersNew.push(createRandomUser());
      });
      setUsers((prevUsers) => [...prevUsers, ...usersNew]);
      console.log(`+${length} users from gen.fun.`);
    },
    [createRandomUser]
  );

  useEffect(() => {
    if (seedInput !== "" && page <= 2) {
      setUsers([]);
      generateUsers(20);
    }
    if (page > 2) {
      faker.seed(+inputRef.current.value + page);
      const usersCount = 10 * page;
      setUsers([]);
      generateUsers(usersCount);
    }
  }, [seedInput, generateUsers, page, errorNum, locale]);

  const handleScroll = useCallback(
    (e) => {
      if (
        Math.ceil(e.currentTarget.scrollTop) + e.currentTarget.clientHeight ===
          e.currentTarget.scrollHeight &&
        seedInput !== ""
      ) {
        setPage((prev) => prev + 1);
        generateUsers(10);
      }
    },
    [seedInput, generateUsers]
  );

  const randomizeButtonHandler = useCallback(() => {
    const newSeed = faker.seed();
    setSeedInput(newSeed);
  }, []);

  const onInputChangeHandler = useCallback((e) => {
    const newInputSeed = faker.seed(+e.target.value);
    setSeedInput(newInputSeed);
  }, []);

  const changeLocaleHandler = useCallback((e) => {
    const locale = e.target.value;
    switch (locale) {
      case "fr":
        faker.locale = "fr";
        break;
      case "de":
        faker.locale = "de";
        break;
      default:
        faker.locale = "en";
        break;
    }
    setLocale(locale);
  }, []);

  return (
    <div className="container text-center mw-50 mt-3">
      <div className="container">
        <div className="row text-start">
          <h1>Fake User Generator</h1>
        </div>
        <div className="row align-items-center ">
          <div className="col-lg">
            <div className="input-group">
              <button
                onClick={randomizeButtonHandler}
                className="btn btn-outline-secondary"
                type="button"
                id="button-addon1"
              >
                Randomize
              </button>
              <input
                ref={inputRef}
                type="text"
                className="form-control"
                onChange={onInputChangeHandler}
                value={seedInput}
                placeholder="Seed value"
                aria-label="Seed input"
              />
            </div>
          </div>
          <div className="col">
            <select
              onChange={changeLocaleHandler}
              className="form-select my-3"
              aria-label="Country"
            >
              <option defaultValue={locale}>Choose country</option>
              <option value="en">America</option>
              <option value="de">Germany</option>
              <option value="fr">France</option>
            </select>
          </div>
          <div className="col ps-4">
            <input
              type="range"
              className="form-range"
              min="0"
              max="10"
              step="0.25"
              id="error_range"
              value={errorNum}
              onChange={(e) => {
                setErrorNum(+e.target.value);
              }}
            />
          </div>
          <div className="col-auto">
            <input
              id="errors"
              placeholder="Set number of errors"
              className="form-control"
              type="number"
              step="0.25"
              min="0"
              max="1000"
              value={errorNum}
              onChange={(e) => {
                setErrorNum(+e.target.value);
              }}
            />
          </div>
        </div>
      </div>
      <div
        onScroll={handleScroll}
        style={{ height: "500px", overflowY: "scroll" }}
      >
        <table className="table" style={{ height: "80vh" }}>
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">ID</th>
              <th scope="col">Name</th>
              <th scope="col">Address</th>
              <th scope="col">Phone number</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, i) => (
              <tr key={user.id}>
                <th scope="row">{i + 1}</th>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.address}</td>
                <td>{user.phone}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <nav aria-label="...">
        <ul className="pagination mt-3">
          <li className="container-sm align-self-center">
            <CSVLink
              headers={[
                { label: "Number", key: "num" },
                { label: "ID", key: "id" },
                { label: "Full Name", key: "name" },
                { label: "Address", key: "address" },
                { label: "Phone", key: "phone" },
              ]}
              data={(() => {
                const csvData = users;

                csvData.forEach((user, i, arr) => {
                  user.num = i + 1;
                });
                return csvData;
              })()}
              filename={"random-users.csv"}
            >
              <button type="button" className="btn btn-secondary">
                Export Users to CSV
              </button>
            </CSVLink>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Table;

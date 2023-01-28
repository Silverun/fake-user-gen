import { faker } from "@faker-js/faker";
import { shuffleNearest, replaceRandom, removeRandom } from "../utils/helpers";
import { CSVLink } from "react-csv";
import React, { useCallback, useState, useEffect, useRef } from "react";

const Table = () => {
  const [locale, setLocale] = useState("en");
  const [users, setUsers] = useState([]);
  const [seedInput, setSeedInput] = useState("");
  const [page, setPage] = useState(2);
  const [errorNum, setErrorNum] = useState(0);
  const pageRef = useRef();
  const inputRef = useRef();

  // const [scrollTop, setScrollTop] = useState(0);
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
        // console.log(`${chance} is success!`);
        errorsChanced = Math.ceil(errorNum);
        // console.log(`upgraded to ${amountChanced}`);
      }
    }

    for (let i = 0; i < errorsChanced; i++) {
      // console.log(fieldChoice());
      // console.log(funcChoice(`hello`));
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
      // console.log(`funcChoice fun ran`);
      const choice = Math.random() * 3;
      if (choice <= 1) {
        // console.log(`Choice 1 remove`);
        return removeRandom(field);
      } else if (choice <= 2) {
        // console.log(`Choice 2 replace`);
        return replaceRandom(field, locale);
      } else {
        // console.log(`Choice 3 shuffle`);
        return shuffleNearest(field);
      }
    }

    function fieldChoice() {
      const choice = Math.random() * 3;
      // console.log(`Field choice fun ran`);
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
    // console.log(`inputRef: ${inputRef.current.value}`);
    if (seedInput !== "" && page <= 2) {
      // We can pass in clean users and generate errors here
      setUsers([]);
      console.log(`Users cleaned`);
      generateUsers(20);
    }
    if (page > 2) {
      console.log(
        `> 2 triggered,  inputRef ${inputRef.current.value}, pageRef ${pageRef.current.innerHTML} `
      );
      const newEffSeed = faker.seed(+inputRef.current.value + page);
      console.log(`Page ${page} updated seed to ${newEffSeed}`);
      const usersCount = 10 * page;
      setUsers([]);
      console.log(`Users cleaned`);
      generateUsers(usersCount);
    }
    // if (page > 2) {
    //   faker.seed(seedInput);
    // }
  }, [seedInput, generateUsers, page, errorNum, locale]);

  const handleScroll = useCallback(
    (e) => {
      // setScrollTop(e.currentTarget.scrollTop);
      if (
        Math.ceil(e.currentTarget.scrollTop) + e.currentTarget.clientHeight ===
          e.currentTarget.scrollHeight &&
        seedInput !== ""
      ) {
        setPage((prev) => prev + 1);
        console.log(`Bottom reached, page +1`);
        generateUsers(10);
        // setSeedInput((prev) => prev + page);
        // console.log(`Input updated by page ${page} func`);
      }
    },
    [seedInput, generateUsers]
  );

  const randomizeButtonHandler = useCallback(() => {
    const newSeed = faker.seed();
    setSeedInput(newSeed);
    console.log(`Randomize button triggered, seed is ${newSeed}`);
  }, []);

  const onInputChangeHandler = useCallback((e) => {
    const newInputSeed = faker.seed(+e.target.value);
    setSeedInput(newInputSeed);
    console.log(`Input function triggered, seed updated to ${newInputSeed}`);
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
          <li className="page-item">
            <label htmlFor="">Pages</label>
            <span
              style={{ color: "black" }}
              ref={pageRef}
              className="page-link"
              href=""
            >
              {page}
            </span>
          </li>
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

      {/* <h2>Scroll Top: {scrollTop}</h2> */}
    </div>
  );
};

export default Table;

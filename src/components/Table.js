import { faker } from "@faker-js/faker";
import React, { useCallback, useEffect, useState } from "react";
// faker.setLocale('de')

const Table = () => {
  const [locale, setLocale] = useState("en");
  const [users, setUsers] = useState([]);
  // const [seed, setSeed] = useState(0);
  const [seedInput, setSeedInput] = useState("");
  const [page, setPage] = useState(1);
  // const [scrollTop, setScrollTop] = useState(0);

  const createRandomUser = () => {
    return {
      id: faker.random.numeric(10),
      name: faker.name.fullName(),
      address: faker.address.streetAddress(true),
      phone: faker.phone.number(),
    };
  };

  const generateUsers = useCallback((length) => {
    const usersNew = [];

    Array.from({ length: length }).forEach(() => {
      usersNew.push(createRandomUser());
    });
    setUsers((prevUsers) => [...prevUsers, ...usersNew]);
  }, []);

  const handleScroll = (e) => {
    // setScrollTop(e.currentTarget.scrollTop);
    // console.log("scrollHeight - " + e.currentTarget.scrollHeight);
    // console.log("clientHeight - " + e.currentTarget.clientHeight);
    // console.log("scrollTop - " + e.currentTarget.scrollTop);
    if (
      Math.ceil(e.currentTarget.scrollTop) + e.currentTarget.clientHeight ===
      e.currentTarget.scrollHeight
    ) {
      console.log("Bottom reached!");
      generateUsers(10);
      setPage((prevPage) => prevPage + 0.5);
    }
  };

  useEffect(() => {
    if (seedInput !== "") {
      setUsers([]);
      generateUsers(20);
      console.log(`Effect ran inside if block`);
    }
    console.log(`Effect ran`);
  }, [seedInput, generateUsers]);

  //7913120977915957 - Israel Weber
  //7257761553160407 - Ethel Beier
  function randomizeButtonHandler() {
    setSeedInput(faker.seed());
  }

  function changeLocaleHandler(e) {
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
    console.log(locale);
  }

  return (
    <div className="container text-center mw-50">
      <select
        onChange={changeLocaleHandler}
        className="form-select m-3"
        aria-label="Default select example"
      >
        <option defaultValue={locale}>Choose country</option>
        <option value="en">EN-en</option>
        <option value="de">GER-de</option>
        <option value="fr">FR-fr</option>
      </select>
      <div className="input-group mb-3">
        <button
          onClick={randomizeButtonHandler}
          className="btn btn-outline-secondary"
          type="button"
          id="button-addon1"
        >
          Randomize
        </button>
        <input
          type="number"
          className="form-control"
          onChange={(e) => {
            setSeedInput(+e.target.value);
            faker.seed(+e.target.value);
          }}
          value={seedInput}
          placeholder="Seed value"
          aria-label="Example text with button addon"
        />
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
            <label htmlFor="">Page</label>
            <span class="page-link" href="">
              {page}
            </span>
          </li>
        </ul>
      </nav>
      {/* <h2>Scroll Top: {scrollTop}</h2> */}
    </div>
  );
};

export default Table;

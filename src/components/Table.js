import { faker } from "@faker-js/faker";
import React, { useCallback, useState, useEffect, useRef } from "react";
// faker.setLocale('de')

const Table = () => {
  const [locale, setLocale] = useState("en");
  const [users, setUsers] = useState([]);
  const [seedInput, setSeedInput] = useState("");
  const [page, setPage] = useState(2);
  const inputRef = useRef();

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
    console.log(`+${length} users from gen.fun.`);
  }, []);

  useEffect(() => {
    console.log(`inputRef: ${inputRef.current.value}`);
    if (seedInput !== "" && page <= 2) {
      setUsers([]);
      console.log(`Users cleaned`);
      generateUsers(20);
    }
    // if (page > 2) {
    //   faker.seed(seedInput);
    // }
  }, [seedInput, generateUsers, page]);

  const handleScroll = useCallback(
    (e) => {
      // setScrollTop(e.currentTarget.scrollTop);
      if (
        Math.ceil(e.currentTarget.scrollTop) + e.currentTarget.clientHeight ===
          e.currentTarget.scrollHeight &&
        seedInput !== ""
      ) {
        console.log("Bottom reached, generating users.");
        generateUsers(10);
        setPage((prev) => {
          return prev + 1;
        });
        // setSeedInput(page);
      }
    },
    [generateUsers, seedInput]
  );

  const randomizeButtonHandler = useCallback(() => {
    setSeedInput(faker.seed());
    console.log(`Randomize button triggered, seed randomized`);
  }, []);

  const onInputChangeHandler = useCallback((e) => {
    setSeedInput(+e.target.value);
    faker.seed(+e.target.value);
    console.log(`Input function triggered, seed updated to ${+e.target.value}`);
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
          ref={inputRef}
          type="number"
          className="form-control"
          onChange={onInputChangeHandler}
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
            <span className="page-link" href="">
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

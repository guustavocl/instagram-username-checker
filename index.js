const axios = require("axios");
const prompt = require("prompt-sync")({ sigint: true });

const USERNAME_TAKEN_MSGS = [
  "This username isn't available.",
  "A user with that username already exists.",
  "This username isn't available. Please try another.",
];

const RATE_LIMITED = ["Please wait a few minutes before you try again."];

const sleep = (ms = 1000) => {
  console.log(`sleeping for ${ms}ms`);
  return new Promise((r) => setTimeout(r, ms));
};

const check_username = async (username = "teste") => {
  console.log(` == ${username} == Checking Instagram username`);
  let checked = await check_userpage(username)
    .then((response) => {
      if (response?.data?.user?.full_name != undefined) {
        console.log(` == ${username} == UserPage GET: Username taken :/`);
        return true;
      } else {
        console.log(
          ` == ${username} == UserPage GET: User null try another method`
        );
        return false;
      }
    })
    .catch(() => {
      console.log(
        ` == ${username} == UserPage GET: 404 will try another method`
      );
      return false;
    });

  if (!checked)
    await check_on_create(username)
      .then((response) => {
        if (response.data?.errors?.username) {
          let msg = response.data?.errors?.username[0]?.message;
          if (msg && !USERNAME_TAKEN_MSGS.includes(msg)) {
            console.log(
              ` == ${username} == UserCreate POST: Username available! :D`
            );
          } else {
            console.log(
              ` == ${username} == UserCreate POST: Username taken :/`
            );
          }
        } else {
          console.log(
            ` == ${username} == UserCreate POST: Username available! :D`
          );
        }
      })
      .catch((err) => {
        console.log(` == ${username} == UserCreate POST: Error`);
        if (RATE_LIMITED.includes(err.response?.data?.message)) {
          console.log(
            ` == ${username} == UserCreate POST: Rate limted, try again later ~`
          );
        } else {
          console.log(err);
        }
      });
};

const check_on_create = async (username) => {
  return new Promise((resolve, reject) => {
    axios
      .post(
        "https://www.instagram.com/api/v1/web/accounts/web_create_ajax/attempt/",
        {
          email: "teste@teste.com",
          username: username,
          first_name: "teste",
        },
        {
          headers: {
            accept: "*/*",
            "accept-language": "en",
            "content-type": "application/x-www-form-urlencoded",
            "sec-ch-prefers-color-scheme": "dark",
            "sec-ch-ua":
              '"Not?A_Brand";v="8", "Chromium";v="108", "Microsoft Edge";v="108"',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": '"Windows"',
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "x-asbd-id": "198387",
            "x-csrftoken": "7ri3We2izQGHMdaT0DHqZuUxoAKvNibx",
            "x-ig-app-id": "936619743392459",
            "x-ig-www-claim": "0",
            "x-instagram-ajax": "1006804047",
            "x-requested-with": "XMLHttpRequest",
            cookie:
              "ig_did=CDC3CDC6-B9AA-4875-ACEA-A214C1C1039C; ig_nrcb=1; dpr=1.100000023841858; csrftoken=7ri3We2izQGHMdaT0DHqZuUxoAKvNibx; mid=Y74oGAALAAEH8FYaA9AHib8eYwQy; datr=Fyi-Y4dpVmvFiSq2TIPHgoy3",
            Referer: "https://www.instagram.com/accounts/emailsignup/",
            "Referrer-Policy": "strict-origin-when-cross-origin",
          },
        }
      )
      .then((response) => {
        resolve(response);
      })
      .catch((err) => {
        reject();
      });
  });
};

const check_userpage = async (username) => {
  return new Promise((resolve, reject) => {
    axios
      .get(
        `https://www.instagram.com/api/v1/users/web_profile_info/?username=${username}`,
        {
          headers: {
            accept: "*/*",
            "accept-language": "en",
            "sec-ch-prefers-color-scheme": "dark",
            "sec-ch-ua":
              '"Not?A_Brand";v="8", "Chromium";v="108", "Microsoft Edge";v="108"',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": '"Windows"',
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "x-asbd-id": "198387",
            "x-csrftoken": "7ri3We2izQGHMdaT0DHqZuUxoAKvNibx",
            "x-ig-app-id": "936619743392459",
            "x-ig-www-claim": "0",
            "x-requested-with": "XMLHttpRequest",
            cookie:
              "ig_did=CDC3CDC6-B9AA-4875-ACEA-A214C1C1039C; ig_nrcb=1; dpr=1.100000023841858; csrftoken=7ri3We2izQGHMdaT0DHqZuUxoAKvNibx; mid=Y74oGAALAAEH8FYaA9AHib8eYwQy; datr=Fyi-Y4dpVmvFiSq2TIPHgoy3",
            Referer: "https://www.instagram.com/guustavocl/",
            "Referrer-Policy": "strict-origin-when-cross-origin",
          },
        }
      )
      .then((response) => {
        resolve(response?.data);
      })
      .catch(() => {
        reject();
      });
  });
};

const menu = async () => {
  console.clear();
  console.log("#1 - Check username");
  let choice = prompt("");
  if (choice == "1") {
    console.clear();
    menu_check_username();
  } else {
    console.clear();
    menu();
  }
};

const menu_check_username = async () => {
  console.log("\n# Type the username you wanna check:");
  let username = prompt("");
  if (username) {
    console.clear();
    await check_username(username);
    menu_check_username();
  } else {
    console.clear();
    menu_check_username();
  }
};

menu();

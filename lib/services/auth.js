import { api, url } from "@/config";
import axios from "axios";
import { toast } from "react-toastify";

export async function signIn({ email, password }) {
  try {
    const { data } = await axios.post(`${api}/api/auth/local`, {
      identifier: email,
      password,
    });

    return data;
  } catch (error) {
    console.error(error.message || error);
  }
}

export async function signUp({ first_name, last_name, identifier, password }) {
  try {
    console.log("signUp", {
      first_name,
      last_name,
      identifier,
      password,
    });
    const { data, status } = await axios.post(
      `${api}/api/auth/local/register`,
      {
        email: identifier,
        username: identifier,
        password,
        first_name,
        last_name,
        name: first_name + " " + last_name,
      },
    );

    if (status === 200 || status === 201) {
      const stripeResponse = await axios.post(`${url}/api/register`, {
        first_name,
        last_name,
        email: identifier,
      });

      if (stripeResponse?.status === 200) {
        const updatedUser = await axios.put(
          `${api}/api/users/${data?.user?.id}`,
          { stripe_customer_id: stripeResponse?.data?.id },
        );

        return updatedUser;
      }
    } else {
      return { data, status };
    }
  } catch (error) {
    if (error?.response?.status === 401) {
      return { status: 200 };
    }

    console.error(error);
  }
}

export async function getUserRole(token) {
  try {
    const { data } = axios.get(`${api}/users/me?populate=role`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return data?.user?.role;
  } catch (error) {
    console.log(error.message || error);
  }
}

export async function forgotPassword(email) {
  try {
    return await axios.post(`${api}/api/auth/forgot-password`, {
      email,
    });
  } catch (error) {
    return error;
  }
}

export async function resetPassword(token, password, confirmPassword) {
  try {
    return await axios.post(`${api}/api/auth/reset-password`, {
      code: token,
      password,
      passwordConfirmation: confirmPassword,
    });
  } catch (error) {
    return error;
  }
}

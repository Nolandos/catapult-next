export const getProjects = async () => {
  const url = `${process.env.NEXT_PUBLIC_CMS_ADDRESS}/api/projects?populate=image`;

  try {
    const res = await fetch(url);
    const json = await res?.json();
    return json.data;
  } catch (err) {
    return err;
  }
};
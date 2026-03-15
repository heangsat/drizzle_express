
export const validateUserData = (req, res, next) => {
    const {name,email} = req.body;
    //regex for name prevent special characters and numbers
    const nameRegex = /^[a-zA-Z\s]+$/;
    if (!nameRegex.test(name)) {
        return res.status(400).json({ error: "Name must contain only letters and spaces" });
    }
    //regex for email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: "Invalid email format" });
    }

    if(!name || !email){
        return res.status(400).json({ error: "Name and email are required " });
    }

    if (typeof name !== "string" || typeof email !== "string"){
        return res.status(400).json({ error: "Name and email must be strings" });
    }
    next();
}
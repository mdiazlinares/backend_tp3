const jwt = require('jsonwebtoken');

const validarJWT = (req, res, next) => {
	try {
		const token = req.header('x-token');

		if (!token) {
			return res.status(401).json({
				msg: 'No hay token en la peticion',
			});
		}

		const verificarToken = jwt.verify(token, process.env.SECRET_JWT);
		
	} catch (error) {
		return res.status(401).json({
			msg: 'Token vencido',
		});
	}
	next();
};

module.exports = { validarJWT };

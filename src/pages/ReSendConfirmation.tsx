function ReSendConfirmation() {
  return (
    <div className="flex flex-col items-center justify-center w-full h-[calc(100vh-94px)]">
      <h3 className="text-2xl font-bold text-[#751B80] text-center">
        Escribe el correo que usaste para registrarte.
      </h3>
      <div>
        <form
          className="rounded-lg pt-2 pb-4"
          onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
          }}
        >
          <div className="formDiv">
            <label
              className="text-xs text-muted-foreground"
              htmlFor="newPassword"
            >
              Reenviaremos un enlace de confirmacion a tu correo electronico.
            </label>
            <input
              required
              className="bg-white"
              type="email"
              name="email"
              id="email"
              placeholder="tucorreo@ejemplo.com"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {}}
            />
          </div>

          <div className="formDiv">
            <button className="bg-gradient-mascoti buttom-mascoti">
              Reenviar verificación
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ReSendConfirmation;

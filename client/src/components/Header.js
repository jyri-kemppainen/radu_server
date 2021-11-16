
const Header = ({user,doLogout,openLogin})=>{
    return <header>
        <div id="title">Places App</div>
        {
        user?
            <div id="login" onClick={doLogout}>
                {user.Name}
            </div> :
            <div id="login" onClick={openLogin}>Login</div>
        }
        
    </header>
}

export default Header
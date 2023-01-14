pragma solidity ^0.4.0;

contract projectManagement{

    struct Project{
        string p; //project name
        uint e; // project ending time
        string d; //project department
        string pg; //programador del projecte
        bool isValue; //true=projecte actiu
        bool assigned; //el projecte ja té un pg assignat
    }

    event Start_Project(string p, string d, string pg, uint256 e,address requestor);
    event End_Project(string p,address requestor);
    event Assign_Project(string p, string pg,address requestor);

    mapping(bytes32 => Project) repositoryProjects;

    modifier onlyBy(address _account)
    {
        require(msg.sender == _account);
        _;
    }

    departmentManagement departmentContract;
    function setAddressDPTContract (address addr) public {
        departmentContract = departmentManagement(addr);
    }


    // ----------------------------- START PROJECT -----------------------------
    function start(string _p1, uint256 _e1, string _d1) public {

        bytes32 hash = keccak256(_p1);
        if(repositoryProjects[hash].isValue || _e1 <= now){
            //Si el projecte "_p1" ja existeix o
            //l'instant de finalització "_e1" és incorrecte, cancel·lar transacció
            revert();
        }
        bool exist = departmentContract.exists(_d1);
        if (exist == false){
            //Si el departament no existeix en el repositori de dpts
            revert();
        }
        repositoryProjects[hash] = Project(_p1,_e1,_d1,"Null",true,false);
        bytes32 hash1 = keccak256(_d1);
        departmentContract.incrementProjNumber(_d1); //sumem un projecte al dpt "_d1"
        emit Start_Project(_p1,_d1,"Null",_e1,msg.sender);

    }
    // ----------------------------- END PROJECT -----------------------------
    function end(string _p1) public {

        bytes32 hash = keccak256(_p1);
        if(!repositoryProjects[hash].isValue){
            //Si el projecte "_p1" no existeix, cancel·lar transacció
            revert();
        }
        repositoryProjects[hash].e = now;
        repositoryProjects[hash].isValue = false;

        //restem un projecte al dpt associat al projecte "_p1"
        departmentContract.decrementProjNumber(repositoryProjects[hash].d);
        emit End_Project(_p1,msg.sender);

    }

    // ----------------------------- ASSIGN PROJECT -----------------------------

    function assign(string _p1, string _pg1) public {

        bytes32 hash = keccak256(_p1);

        if(!repositoryProjects[hash].isValue || repositoryProjects[hash].assigned
            || !departmentContract.belongsDPT(_pg1, repositoryProjects[hash].d)){
            //Si el projecte "_p1" no existeix o
            //el projecte "_p1" ja té programador, cancel·lar transacció o
            //el programador "_pg1" no pertany al dpt del projecte "_p1"
            revert();
        }
        repositoryProjects[hash].pg = _pg1;
        repositoryProjects[hash].assigned = true;
        emit Assign_Project(_p1,_pg1,msg.sender);

    }

    // ----------------------------- DERIVED PREDICATES -----------------------------


}
contract departmentManagement{
    function exists(string d) external view returns (bool);
    function belongsDPT(string pg, string d) external view returns (bool);
    function incrementProjNumber(string d) external;
    function decrementProjNumber(string d) external;
}



